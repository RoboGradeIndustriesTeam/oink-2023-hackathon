/*
  Warnings:

  - Added the required column `mediaUid` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaUid` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Media" (
    "uid" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'photo',
    "messageId" INTEGER,
    CONSTRAINT "Media_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fio" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'l2',
    "otdelId" INTEGER NOT NULL,
    "mediaUid" TEXT NOT NULL,
    CONSTRAINT "User_mediaUid_fkey" FOREIGN KEY ("mediaUid") REFERENCES "Media" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_otdelId_fkey" FOREIGN KEY ("otdelId") REFERENCES "Otdel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("fio", "id", "level", "login", "otdelId", "password") SELECT "fio", "id", "level", "login", "otdelId", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
CREATE UNIQUE INDEX "User_fio_key" ON "User"("fio");
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
CREATE TABLE "new_Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "otdelId" INTEGER NOT NULL,
    "mediaUid" TEXT NOT NULL,
    CONSTRAINT "Chat_mediaUid_fkey" FOREIGN KEY ("mediaUid") REFERENCES "Media" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chat_otdelId_fkey" FOREIGN KEY ("otdelId") REFERENCES "Otdel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chat" ("desc", "id", "name", "otdelId") SELECT "desc", "id", "name", "otdelId" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
CREATE UNIQUE INDEX "Chat_id_key" ON "Chat"("id");
CREATE UNIQUE INDEX "Chat_name_key" ON "Chat"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Media_uid_key" ON "Media"("uid");
