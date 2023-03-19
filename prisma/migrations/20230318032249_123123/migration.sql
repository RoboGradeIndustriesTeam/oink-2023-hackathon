-- CreateTable
CREATE TABLE "Posters" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "mediaUid" TEXT NOT NULL,
    CONSTRAINT "Posters_mediaUid_fkey" FOREIGN KEY ("mediaUid") REFERENCES "Media" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Posters_id_key" ON "Posters"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Posters_title_key" ON "Posters"("title");
