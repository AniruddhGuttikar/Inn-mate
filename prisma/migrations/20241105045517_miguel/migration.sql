/*
  Warnings:

  - You are about to drop the column `endDate` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `review` table. All the data in the column will be lost.
  - Added the required column `availabilityEnd` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availabilityStart` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `endDate`,
    DROP COLUMN `startDate`;

-- AlterTable
ALTER TABLE `listing` ADD COLUMN `availabilityEnd` DATETIME(3) NOT NULL,
    ADD COLUMN `availabilityStart` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `review` DROP COLUMN `locationId`;
