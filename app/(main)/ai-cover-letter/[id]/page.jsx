import React from 'react'

const CoverLetterpage = async ({params}) => {
    const id = await params.id;
  return (
    <div>
      CoverLetter : {id}
    </div>
  )
}

export default CoverLetterpage