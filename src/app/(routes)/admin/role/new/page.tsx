import React,{Suspense} from 'react'
import Loader from '@/components/shared/loader/loader'
const NewRoleComponent = React.lazy(()=>import('@/modules/rbac/pages/role/new/new'))
const page = () => {
  return (
    <Suspense fallback={<Loader />}><NewRoleComponent /></Suspense>
  )
}

export default page
