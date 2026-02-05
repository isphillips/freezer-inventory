-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "quantity" REAL,
    "unit" TEXT,
    "packagedDate" DATETIME,
    "expirationDate" DATETIME,
    "imageUrl" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "consumedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("categoryId", "consumedAt", "createdAt", "expirationDate", "id", "imageUrl", "name", "notes", "packagedDate", "quantity", "status", "unit", "updatedAt") SELECT "categoryId", "consumedAt", "createdAt", "expirationDate", "id", "imageUrl", "name", "notes", "packagedDate", "quantity", "status", "unit", "updatedAt" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE INDEX "Item_categoryId_idx" ON "Item"("categoryId");
CREATE INDEX "Item_status_idx" ON "Item"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
