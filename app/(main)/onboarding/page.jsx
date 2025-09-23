import { getUserOnboardingStatus } from '@/actions/user'
import { industries } from '@/data/industries'
import { redirect } from 'next/navigation'

const Onboardingpage = async () => {
    const {isOnboarded} = await getUserOnboardingStatus()

    if(isOnboarded) redirect("/dashboard");
  return (
    <main>
      <Onboardingform industries={industries} /> 
    </main>
  )
}

export default Onboardingpage
