# ============================================================
# Golden Silk Emporium — Multi-Stage Dockerfile
# ============================================================
#
# Stages:
#   base             — shared Node 22 Alpine base
#   deps             — installs all workspace dependencies
#   builder-backend  — compiles TypeScript → dist/, runs prisma generate
#   builder-frontend — Next.js production build
#   image-optimizer  — compresses public/images/* with sharp (PNG + WebP)
#   runner           — lean production image (≈ no dev deps, no src)
#
# Usage:
#   Development  →  docker compose up (uses docker-compose.yml)
#   Production   →  docker compose -f docker-compose.prod.yml up -d
# ============================================================

# ── Base ─────────────────────────────────────────────────────
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    npm_config_update_notifier=false

# ── Dependency Stage ──────────────────────────────────────────
FROM base AS deps
# Copy only manifests so layer caches on code changes but not dep changes
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json  ./backend/package.json

# Install all deps (including devDeps needed for build + sharp for image opt)
RUN npm ci --include=dev

# ── Backend Builder ───────────────────────────────────────────
FROM base AS builder-backend
COPY --from=deps /app/node_modules ./node_modules
COPY backend ./backend
COPY package.json ./

WORKDIR /app/backend
# node_modules are hoisted to /app/node_modules by npm workspaces; no separate copy needed

# Generate Prisma client then compile TypeScript
RUN npx prisma generate --schema=prisma/schema.prisma && \
    npx tsc --project tsconfig.json

# ── Frontend Builder ──────────────────────────────────────────
FROM base AS builder-frontend
# Build-time env vars — injected via --build-arg / CI secrets
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_MAINTENANCE_MODE=false
ARG NEXT_PUBLIC_GA4_ID
ARG NEXT_PUBLIC_GTM_ID
ARG BACKEND_API_URL=http://backend:5001

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_MAINTENANCE_MODE=$NEXT_PUBLIC_MAINTENANCE_MODE \
    NEXT_PUBLIC_GA4_ID=$NEXT_PUBLIC_GA4_ID \
    NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID \
    BACKEND_API_URL=$BACKEND_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY frontend ./frontend
COPY package.json ./

WORKDIR /app/frontend
# node_modules are hoisted to /app/node_modules by npm workspaces; no separate copy needed

RUN npm run build

# ── Image Optimiser ───────────────────────────────────────────
FROM base AS image-optimizer
# sharp npm package bundles prebuilt libvips binaries — no system packages needed.
# The apk add vips-dev / fftw-dev step is intentionally omitted.

COPY --from=deps /app/node_modules ./node_modules
COPY scripts/optimize-images.mjs ./scripts/optimize-images.mjs
# Copy the raw (unoptimised) public folder from the frontend builder
COPY --from=builder-frontend /app/frontend/public ./frontend/public

# Run compression — writes optimised files in place
RUN node scripts/optimize-images.mjs

# ── Production Runner ─────────────────────────────────────────
FROM base AS runner

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 appuser

# ---- Backend runtime ----
WORKDIR /app/backend
COPY --from=builder-backend /app/backend/dist ./dist
COPY --from=builder-backend /app/backend/prisma ./prisma

# Dependencies come from the deps stage (npm workspaces)
COPY --from=deps /app/node_modules /app/node_modules

COPY backend/package.json ./

# ---- Frontend runtime ----
WORKDIR /app/frontend
# Only the standalone output + public assets (no src needed in production)
COPY --from=builder-frontend /app/frontend/.next/standalone   ./.next/standalone
COPY --from=builder-frontend /app/frontend/.next/static       ./.next/static
COPY --from=image-optimizer  /app/frontend/public             ./public

RUN chown -R appuser:nodejs /app
USER appuser

# Expose both services (nginx in docker-compose will proxy)
EXPOSE 3000
EXPOSE 5001

# Default: start backend (frontend is typically started separately or via compose)
WORKDIR /app
CMD ["node", "backend/dist/index.js"]
