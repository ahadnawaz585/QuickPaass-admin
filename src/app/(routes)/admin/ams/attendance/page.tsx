import Loader from '@/components/shared/loader/loader';
import React, { Suspense } from 'react'
const AttenndanceComponent = React.lazy(() => import('@/modules/AMS/pages/attendance/attendance'));

const page = () => {
  return (
    <Suspense fallback={<Loader />}><AttenndanceComponent /></Suspense>
  )
}

export default page
