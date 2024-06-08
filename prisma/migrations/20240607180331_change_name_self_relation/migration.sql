/*
  Warnings:

  - You are about to drop the column `lastUpdateBy` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_lastUpdateBy_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastUpdateBy",
ADD COLUMN     "lastUpdateById" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lastUpdateById_fkey" FOREIGN KEY ("lastUpdateById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
