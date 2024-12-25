import Loader from '@/components/shared/loader/loader';
import React, { Suspense } from 'react'
const UpdateEmployeeComponent = React.lazy(() => import('@/modules/AMS/pages/employees/edit/editEmployee'));

const page = () => {
  return (
    <Suspense fallback={<Loader />}><UpdateEmployeeComponent /></Suspense>
  )
}

export default page
