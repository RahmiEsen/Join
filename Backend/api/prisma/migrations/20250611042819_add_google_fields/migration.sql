-- AlterTable
ALTER TABLE "user" ADD COLUMN     "picture" TEXT,
ADD COLUMN     "provider" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
