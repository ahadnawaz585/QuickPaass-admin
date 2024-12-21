import React, { Suspense } from 'react'
const EditGroupComponent = React.lazy(() => import('@/modules/rbac/pages/group/edit/edit'));
import Loader from '@/components/shared/loader/loader';
const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <EditGroupComponent />
    </Suspense>
  )
}

export default page
