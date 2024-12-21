import React, { Suspense } from 'react'
import Loader from '@/components/shared/loader/loader';
const EditUser = React.lazy(() => import('@/modules/rbac/pages/user/edit/edit'));
const page = () => {
  return (
      <Suspense fallback={<Loader />}><EditUser /></Suspense>
  )
}

export default page
