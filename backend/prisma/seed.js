const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@test.com"
    },
    update: {},
    create: {
      name: "Priyanshu Kumar",
      email: "admin@test.com",
      password: hashedPassword,
      role: "SUPER_ADMIN"
    }
  });

  console.log("Admin Created:", admin);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });