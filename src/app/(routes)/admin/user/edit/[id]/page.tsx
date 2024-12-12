import React, { Suspense } from 'react'
import Loader from '@/components/shared/loader/Loader';
const EditUser = React.lazy(() => import('@/pages/user/edit/edit'));
const page = () => {
  return (
      <Suspense fallback={<Loader />}><EditUser /></Suspense>
  )
}

export default page
