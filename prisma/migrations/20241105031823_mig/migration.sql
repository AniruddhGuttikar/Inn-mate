/*
  Warnings:

  - A unique constraint covering the columns `[userId,propertyId]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Listing_userId_propertyId_key` ON `Listing`(`userId`, `propertyId`);
