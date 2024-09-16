/*
  Warnings:

  - You are about to drop the column `email` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `Question` table. All the data in the column will be lost.
  - Added the required column `text` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Question_email_key";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "email",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "surname",
ADD COLUMN     "text" TEXT NOT NULL;
