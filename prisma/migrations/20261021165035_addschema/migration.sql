-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('UP', 'DOWN', 'UNKOWN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Website_Ticks" (
    "id" TEXT NOT NULL,
    "response_time" INTEGER NOT NULL,
    "region_id" TEXT NOT NULL,
    "website_id" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'DOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- CreateIndex
CREATE UNIQUE INDEX "Website_id_key" ON "Website"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Website_url_key" ON "Website"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Region_id_key" ON "Region"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Website_Ticks_id_key" ON "Website_Ticks"("id");

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Website_Ticks" ADD CONSTRAINT "Website_Ticks_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Website_Ticks" ADD CONSTRAINT "Website_Ticks_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
