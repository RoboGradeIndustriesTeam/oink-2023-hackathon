/*
  Warnings:

  - Added the required column `desc` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "faImageClasses" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL
);
INSERT INTO "new_News" ("faImageClasses", "id") SELECT "faImageClasses", "id" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
CREATE UNIQUE INDEX "News_id_key" ON "News"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
