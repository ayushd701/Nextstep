import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/dashboard-view";
import { checkUser } from "@/lib/checkUser";
import { requireOnboarding } from "@/lib/requireOnboarding";

const IndustryInsightsPage = async () => {
  await requireOnboarding();

  const insights = await getIndustryInsights();

  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsightsPage;
