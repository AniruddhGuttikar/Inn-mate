/*
  Warnings:

  - Made the column `state` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "state" SET NOT NULL;
