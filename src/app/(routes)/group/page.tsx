import Loader from '@/components/shared/loader/Loader';
import React, { Suspense } from 'react'
const GroupComponent = React.lazy(() => import('@/pages/group/group'));

const page = () => {
  return (
    <Suspense fallback={<Loader />}><GroupComponent /></Suspense>
  )
}

export default page
