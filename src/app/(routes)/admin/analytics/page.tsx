import Loader from '@/components/shared/loader/loader';
import React, { Suspense } from 'react'
const AdminComponent = React.lazy(() => import('@/pages/Analytics/analytics'));

const page = () => {
  return (
    <Suspense fallback={<Loader />}><AdminComponent /></Suspense>
  )
}

export default page