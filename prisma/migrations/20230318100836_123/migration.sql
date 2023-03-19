-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'otdel-chat',
    "otdelId" INTEGER,
    "mediaUid" TEXT NOT NULL,
    "userId1" INTEGER,
    "userId2" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "Chat_mediaUid_fkey" FOREIGN KEY ("mediaUid") REFERENCES "Media" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chat_otdelId_fkey" FOREIGN KEY ("otdelId") REFERENCES "Otdel" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Chat_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Chat_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chat" ("desc", "id", "mediaUid", "name", "otdelId", "type", "userId", "userId1", "userId2") SELECT "desc", "id", "mediaUid", "name", "otdelId", "type", "userId", "userId1", "userId2" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
CREATE UNIQUE INDEX "Chat_id_key" ON "Chat"("id");
CREATE UNIQUE INDEX "Chat_name_key" ON "Chat"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
