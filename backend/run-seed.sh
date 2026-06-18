#!/bin/bash
cd /Users/karthiknaramala/Desktop/golden-silk-emporium/backend
npm run prisma:generate
npm run db:seed
echo "Database seeded successfully!"
