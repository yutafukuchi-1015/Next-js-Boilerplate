import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // eslint-disable-next-line no-console
  console.log('Start seeding...');

  // Create initial counter record
  const counter = await prisma.counter.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      count: 0,
    },
  });

  // eslint-disable-next-line no-console
  console.log('Created counter:', counter);
  // eslint-disable-next-line no-console
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
