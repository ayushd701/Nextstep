import { getUserOnboardingStatus } from "@/actions/user";
import { industries } from "@/data/industries";
import { redirect } from "next/navigation";
import OnboardingForm from "./_components/onboardingform";
import { checkUser } from "@/lib/checkUser";

const Onboardingpage = async () => {
  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
};

export default Onboardingpage;
