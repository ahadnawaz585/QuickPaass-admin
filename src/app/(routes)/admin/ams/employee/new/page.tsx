import Loader from '@/components/shared/loader/loader';
import React, { Suspense } from 'react'
const NewEmployeeComponent = React.lazy(() => import('@/modules/AMS/pages/employees/new/newEmployee'));

const page = () => {
  return (
    <Suspense fallback={<Loader />}><NewEmployeeComponent /></Suspense>
  )
}

export default page
