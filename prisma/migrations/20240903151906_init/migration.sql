-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "time" TEXT,
    "fileName" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL,
    "repeat" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_name_key" ON "Task"("name");
