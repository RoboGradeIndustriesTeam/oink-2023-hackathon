-- CreateTable
CREATE TABLE "Otdel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fio" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'l2',
    "otdelId" INTEGER NOT NULL,
    CONSTRAINT "User_otdelId_fkey" FOREIGN KEY ("otdelId") REFERENCES "Otdel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Otdel_id_key" ON "Otdel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Otdel_name_key" ON "Otdel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_fio_key" ON "User"("fio");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
