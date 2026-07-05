#!/bin/bash
cd /Users/karthiknaramala/Desktop/Drapeva/backend
npm run prisma:generate
npm run db:seed
echo "Database seeded successfully!"
