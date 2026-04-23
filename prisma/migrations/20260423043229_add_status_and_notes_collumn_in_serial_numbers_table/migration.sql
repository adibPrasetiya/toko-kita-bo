/*
  Warnings:

  - Added the required column `notes` to the `serial_numbers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `serial_numbers` ADD COLUMN `notes` VARCHAR(255) NOT NULL,
    ADD COLUMN `status` ENUM('SOLD', 'AVAILABLE', 'SELL') NOT NULL DEFAULT 'AVAILABLE';
