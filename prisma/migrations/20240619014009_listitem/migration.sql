-- CreateTable
CREATE TABLE "ListItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "itemId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,

    CONSTRAINT "ListItem_pkey" PRIMARY KEY ("itemId","listId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListItem_id_key" ON "ListItem"("id");

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
