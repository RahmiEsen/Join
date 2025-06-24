import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: { id: 'guest' },
        update: {},
        create: {
        id: 'guest',
        email: 'guest@system.local',
        firstName: 'Gast',
        lastName: 'System',
        provider: 'guest',
        },
    });
    console.log('✅ Gast-User wurde angelegt oder existiert bereits');
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
