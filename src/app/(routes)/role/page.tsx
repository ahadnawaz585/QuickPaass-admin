import Loader from '@/components/shared/loader/Loader';
import React, { Suspense } from 'react'
const RoleComponent = React.lazy(() => import('@/pages/role/role'));
const page = () => {
  return (
    <Suspense fallback={<Loader />}><RoleComponent /></Suspense>
  )
}

export default page
