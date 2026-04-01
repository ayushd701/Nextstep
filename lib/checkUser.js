"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();

    if (!user) return null;

    let loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) return loggedInUser;

    // 🔥 create user properly (IMPORTANT)
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        email: user.emailAddresses?.[0]?.emailAddress || "",
        imageUrl: user.imageUrl || "",
      },
    });

    return newUser;
  } catch (error) {
    console.log("checkUser error:", error);
    return null;
  }
};