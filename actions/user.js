"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAiInsights } from "./dashboard";
import { checkUser } from "@/lib/checkUser"; // 🔥 added

// ================== UPDATE USER ==================
export async function updateUser(data) {
  const user = await checkUser(); // 🔥 ensure user exists
  if (!user) throw new Error("Unauthorized");

  let industryInsight = await db.industryInsight.findUnique({
    where: { industry: data.industry },
  });

  let insights = null;
  if (!industryInsight) {
    insights = await generateAiInsights(data.industry);
  }

  try {
    const result = await db.$transaction(async (tx) => {
      if (!industryInsight && insights) {
        industryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ),
          },
        });
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id }, // 🔥 FIXED (was clerkUserId)
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        },
      });

      return { updatedUser, industryInsight };
    });

    return { success: true, ...result };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

// ================== ONBOARDING STATUS ==================
export async function getUserOnboardingStatus() {
  try {
    const user = await checkUser(); // 🔥 ensures user exists

    if (!user) {
      return { isOnboarded: false };
    }

    return {
      isOnboarded: !!user.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return { isOnboarded: false };
  }
}

// ================== GET USER PROFILE ==================
export async function getUserProfile() {
  try {
    const user = await checkUser(); // 🔥 ensures user exists

    if (!user) {
      return { success: true, data: null };
    }

    let industry = null;
    let subIndustry = null;

    if (user.industry) {
      const parts = user.industry.split("-");
      industry = parts[0];
      subIndustry = parts.slice(1).join(" ");
    }

    return {
      success: true,
      data: {
        industry,
        subIndustry,
        experience: user.experience,
        bio: user.bio,
        skills: user.skills,
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    throw new Error("Failed to fetch profile");
  }
}