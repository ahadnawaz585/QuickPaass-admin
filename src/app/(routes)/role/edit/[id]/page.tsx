import Loader from '@/components/shared/loader/Loader';
import React, { Suspense } from 'react'
const EditRoleComponent = React.lazy(() => import('@/pages/role/edit/edit'));
const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <EditRoleComponent />
    </Suspense>
  )
}

export default page
