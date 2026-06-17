# Deployment Guide - Golden Silk Emporium (Maaya Couture)

This guide documents the procedures for launching both local development and production environments.

## 1. Local Development Setup

To start PostgreSQL and Redis locally, run Docker Compose:

```bash
docker compose up -d
```

Navigate to the `server/` directory, configure `.env`, install packages, run database pushes/seeds, and launch the API server:

```bash
cd server
npm install
npx prisma db push
npm run db:seed
npm run dev
```

In a separate terminal, install packages and start the React/TanStack Start client:

```bash
npm install
npm run dev
```

---

## 2. Production Environment Variables

Ensure the following variables are configured in the host environment or cloud deployment dashboard:

| Variable                   | Description                     | Example                               |
| -------------------------- | ------------------------------- | ------------------------------------- |
| `DATABASE_URL`             | PostgreSQL connection string    | `postgresql://user:pass@host:5432/db` |
| `PORT`                     | Backend port                    | `5000`                                |
| `JWT_SECRET`               | Auth Token signature            | `your-high-entropy-jwt-secret`        |
| `JWT_REFRESH_SECRET`       | Refresh Token signature         | `your-high-entropy-refresh-secret`    |
| `STRIPE_SECRET_KEY`        | Stripe gateway private key      | `sk_live_...`                         |
| `RAZORPAY_KEY_ID`          | Razorpay gateway key ID         | `rzp_live_...`                        |
| `RAZORPAY_KEY_SECRET`      | Razorpay gateway private secret | `secret_...`                          |
| `RESEND_API_KEY`           | Mailer client key               | `re_...`                              |
| `CLOUDINARY_URL`           | Cloudinary credentials          | `cloudinary://api_key:secret@name`    |
| `REDIS_URL`                | Redis connection URL            | `redis://default:password@host:6379`  |
| `WHATSAPP_API_TOKEN`       | Meta Developer whatsapp token   | `EAAB...`                             |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta phone profile ID           | `102...`                              |

---

## 3. Production Deployment with Docker

To build and launch all containers (Nginx reverse proxy, Express backend, PostgreSQL database, and Redis cache), execute:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```
