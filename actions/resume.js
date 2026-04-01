"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkUser } from "@/lib/checkUser"; // 🔥 added

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

// ================== SAVE RESUME ==================
export async function saveResume(content) {
  const user = await checkUser(); // 🔥 ensure user exists
  if (!user) throw new Error("Unauthorized");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error in saving resume:", error.message);
    throw new Error("Failed to save resume");
  }
}

// ================== GET RESUME ==================
export async function getResume() {
  const user = await checkUser(); // 🔥 ensure user exists
  if (!user) return null; // 🔥 safe fallback

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

// ================== IMPROVE WITH AI ==================
export async function improveWithAI({ current, type }) {
  const user = await checkUser(); // 🔥 ensure user exists
  if (!user) throw new Error("Unauthorized");

  // 🔥 fetch industryInsight separately (since checkUser doesn't include it)
  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      industryInsight: true,
    },
  });

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${fullUser?.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}