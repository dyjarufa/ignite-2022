/*
  Warnings:

  - You are about to drop the column `obervation` on the `schedulings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `schedulings` DROP COLUMN `obervation`,
    ADD COLUMN `observations` VARCHAR(191) NULL;
