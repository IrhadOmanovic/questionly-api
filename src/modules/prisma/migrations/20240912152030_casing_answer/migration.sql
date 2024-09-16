/*
  Warnings:

  - You are about to drop the column `Answer` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `text` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "Answer",
ADD COLUMN     "text" TEXT NOT NULL;
