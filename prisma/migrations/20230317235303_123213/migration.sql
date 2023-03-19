/*
  Warnings:

  - You are about to drop the column `messageId` on the `Media` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_MediaToMessage" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MediaToMessage_A_fkey" FOREIGN KEY ("A") REFERENCES "Media" ("uid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MediaToMessage_B_fkey" FOREIGN KEY ("B") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Media" (
    "uid" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'photo'
);
INSERT INTO "new_Media" ("type", "uid") SELECT "type", "uid" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
CREATE UNIQUE INDEX "Media_uid_key" ON "Media"("uid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_MediaToMessage_AB_unique" ON "_MediaToMessage"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaToMessage_B_index" ON "_MediaToMessage"("B");
