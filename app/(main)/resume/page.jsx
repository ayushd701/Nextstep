import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume_builder";
import { checkUser } from "@/lib/checkUser";
import { requireOnboarding } from "@/lib/requireOnboarding";

export default async function ResumePage() {
  await requireOnboarding();
  const resume = await getResume();

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
}
