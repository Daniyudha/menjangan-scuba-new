-- CreateTable
CREATE TABLE `GalleryVideo` (
    `id` VARCHAR(191) NOT NULL,
    `youtubeUrl` VARCHAR(191) NOT NULL,
    `caption` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
