-- CreateTable
CREATE TABLE "schedulings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "obervation" TEXT,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_Id" TEXT NOT NULL,
    CONSTRAINT "schedulings_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
