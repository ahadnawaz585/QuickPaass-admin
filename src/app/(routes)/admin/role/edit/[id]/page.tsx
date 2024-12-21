import Loader from '@/components/shared/loader/loader';
import React, { Suspense } from 'react'
const EditRoleComponent = React.lazy(() => import('@/modules/rbac/pages/role/edit/edit'));
const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <EditRoleComponent />
    </Suspense>
  )
}

export default page
