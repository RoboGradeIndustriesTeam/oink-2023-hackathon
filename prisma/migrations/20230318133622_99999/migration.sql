-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fio" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'l2',
    "otdelId" INTEGER NOT NULL,
    "mediaUid" TEXT,
    CONSTRAINT "User_mediaUid_fkey" FOREIGN KEY ("mediaUid") REFERENCES "Media" ("uid") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_otdelId_fkey" FOREIGN KEY ("otdelId") REFERENCES "Otdel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("fio", "id", "level", "login", "mediaUid", "otdelId", "password") SELECT "fio", "id", "level", "login", "mediaUid", "otdelId", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
CREATE UNIQUE INDEX "User_fio_key" ON "User"("fio");
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
