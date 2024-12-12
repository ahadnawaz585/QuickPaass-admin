import React,{Suspense} from 'react'
import Loader from '@/components/shared/loader/loader'
const NewGroupComponent = React.lazy(()=>import('@/pages/group/new/new'))
const page = () => {
  return (
    <Suspense fallback={<Loader/>}><NewGroupComponent /></Suspense>
  )
}

export default page
