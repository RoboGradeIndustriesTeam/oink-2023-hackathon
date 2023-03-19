/*
  Warnings:

  - You are about to drop the column `type` on the `Media` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Media" (
    "uid" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Media" ("uid") SELECT "uid" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
CREATE UNIQUE INDEX "Media_uid_key" ON "Media"("uid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
