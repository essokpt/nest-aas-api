-- CreateTable
CREATE TABLE "Files" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "size" TEXT,
    "type" TEXT,
    "path" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Files_filename_key" ON "Files"("filename");
