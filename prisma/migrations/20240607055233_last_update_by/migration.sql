-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastUpdateBy" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lastUpdateBy_fkey" FOREIGN KEY ("lastUpdateBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
