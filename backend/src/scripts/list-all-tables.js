import prisma from "../config/prisma.js";

async function main() {
  try {
    const res = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log("All tables in DB:");
    console.log(res.map(r => r.table_name));
  } catch (err) {
    console.error("Failed to query tables:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
