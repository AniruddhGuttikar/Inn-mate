/*
  Warnings:

  - Added the required column `availabilityEnd` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availabilityStart` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "availabilityEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "availabilityStart" TIMESTAMP(3) NOT NULL;
