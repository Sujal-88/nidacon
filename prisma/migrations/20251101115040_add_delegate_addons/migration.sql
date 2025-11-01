-- AlterTable
ALTER TABLE "User" ADD COLUMN     "abstractUrl" TEXT,
ADD COLUMN     "paperCategory" TEXT,
ADD COLUMN     "paperUrl" TEXT,
ADD COLUMN     "posterCategory" TEXT,
ADD COLUMN     "posterUrl" TEXT,
ADD COLUMN     "purchasedBanquetAddon" BOOLEAN DEFAULT false,
ADD COLUMN     "purchasedImplantAddon" BOOLEAN DEFAULT false;
