import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient();

// to prevent new client generation every tym
if(process.env.NODE_ENV !== "production")
{
    globalThis.prisma = db;
}