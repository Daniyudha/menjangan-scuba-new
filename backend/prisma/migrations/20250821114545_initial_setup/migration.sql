/*
  Warnings:

  - You are about to drop the column `value` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `experience` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hero` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialLinks` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` ALTER COLUMN `status` DROP DEFAULT,
    MODIFY `date` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Setting` DROP COLUMN `value`,
    ADD COLUMN `experience` JSON NOT NULL,
    ADD COLUMN `hero` JSON NOT NULL,
    ADD COLUMN `socialLinks` JSON NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL DEFAULT 'main_settings';

-- AlterTable
ALTER TABLE `Submission` DROP COLUMN `isRead`,
    MODIFY `date` VARCHAR(191) NOT NULL;
