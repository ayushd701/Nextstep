import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";

export async function requireOnboarding() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }
}