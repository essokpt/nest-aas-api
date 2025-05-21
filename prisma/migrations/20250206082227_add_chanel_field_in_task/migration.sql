-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "time" TEXT,
    "fileName" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL,
    "repeat" BOOLEAN NOT NULL,
    "chanel" INTEGER NOT NULL DEFAULT 1
);
INSERT INTO "new_Task" ("description", "enable", "fileName", "id", "name", "repeat", "time") SELECT "description", "enable", "fileName", "id", "name", "repeat", "time" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_name_key" ON "Task"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
