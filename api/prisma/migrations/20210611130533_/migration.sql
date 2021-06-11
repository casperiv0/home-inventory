-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole" NOT NULL DEFAULT E'USER',
    "houseId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "warnOnQuantity" INTEGER NOT NULL DEFAULT 2,
    "price" DOUBLE PRECISION NOT NULL,
    "prices" DOUBLE PRECISION[],
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expirationDate" TEXT,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "houseId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "House" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "houseId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HouseToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product.name_unique" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "House.name_unique" ON "House"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category.name_unique" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_HouseToUser_AB_unique" ON "_HouseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_HouseToUser_B_index" ON "_HouseToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "House" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HouseToUser" ADD FOREIGN KEY ("A") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HouseToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
