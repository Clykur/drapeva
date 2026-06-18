#!/bin/bash
set -e

echo "============================================="
echo "   Maaya Couture - Supabase & Assets Setup"
echo "============================================="

echo "1. Installing Supabase JS SDK dependencies..."
npm install @supabase/supabase-js -w frontend -w backend --legacy-peer-deps --no-audit --no-fund

echo "2. Copying generated saree images..."
sh frontend/scripts/copy-via-osascript.sh

echo "3. Generating Prisma client & seeding Supabase database..."
sh backend/run-seed.sh

echo "============================================="
echo "   Setup Completed successfully!"
echo "============================================="
