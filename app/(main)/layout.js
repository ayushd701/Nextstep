import React from 'react'
import { checkUser } from '@/lib/checkUser';
import { requireOnboarding } from '@/lib/requireOnboarding';

const Mainlayout = async ({children})  => {
  
  return (
    <div className='container mx-auto mt-24 mb-20'>
      {children}
    </div>
  )
}

export default Mainlayout
