CREATE TABLE IF NOT EXISTS "members" (
    "id" SERIAL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image" TEXT,
    "postsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "totalPosts" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "bounty" (
    "id" SERIAL PRIMARY KEY,
    "gateway" VARCHAR(100) NOT NULL,
    "transaction_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_number" VARCHAR(100),
    "sub_account" VARCHAR(250),
    "amount_in" NUMERIC(20,2) NOT NULL DEFAULT 0.00,
    "amount_out" NUMERIC(20,2) NOT NULL DEFAULT 0.00,
    "accumulated" NUMERIC(20,2) NOT NULL DEFAULT 0.00,
    "code" VARCHAR(250),
    "transaction_content" TEXT,
    "reference_number" VARCHAR(255),
    "body" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
