import Loader from '@/components/shared/loader/loader';
import React, { Suspense } from 'react'
const RoleComponent = React.lazy(() => import('@/modules/rbac/pages/role/role'));
const page = () => {
  return (
    <Suspense fallback={<Loader />}><RoleComponent /></Suspense>
  )
}

export default page
