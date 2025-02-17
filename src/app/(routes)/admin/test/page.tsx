import React from 'react'
import FaceRegistration from '@/modules/AMS/components/faceRegistration/faceRecognization';
import FaceMatching from '@/modules/AMS/components/faceMatching/faceMatching';
const page = () => {
  return (
    <>
    {/* // <div>page</div> */}
    <FaceRegistration />
    <FaceMatching />
    {/* // faceRecogni */}
    </>
  )
}

export default page