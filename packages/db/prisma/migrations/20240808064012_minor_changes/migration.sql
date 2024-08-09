/*
  Warnings:

  - You are about to drop the column `email` on the `Rooms` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Rooms_email_key";

-- AlterTable
CREATE SEQUENCE messages_id_seq;
ALTER TABLE "Messages" ALTER COLUMN "id" SET DEFAULT nextval('messages_id_seq');
ALTER SEQUENCE messages_id_seq OWNED BY "Messages"."id";

-- AlterTable
ALTER TABLE "Rooms" DROP COLUMN "email";
