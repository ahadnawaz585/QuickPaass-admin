import React,{Suspense} from 'react'
import Loader from '@/components/shared/loader/Loader'
const NewRoleComponent = React.lazy(()=>import('@/pages/role/new/new'))
const page = () => {
  return (
    <Suspense fallback={<Loader />}><NewRoleComponent /></Suspense>
  )
}

export default page
