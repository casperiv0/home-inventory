-- DropForeignKey
ALTER TABLE "House" DROP CONSTRAINT "House_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_houseId_fkey";

-- RenameIndex
ALTER INDEX "House_shoppingListId_unique" RENAME TO "House_shoppingListId_key";
