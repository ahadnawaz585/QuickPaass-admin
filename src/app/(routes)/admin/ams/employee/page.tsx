import Loader from '@/components/shared/loader/loader';
import React, { Suspense } from 'react'
const EmployeeComponent = React.lazy(() => import('@/modules/AMS/pages/employees/employees'));

const page = () => {
  return (
    <Suspense fallback={<Loader />}><EmployeeComponent /></Suspense>
  )
}

export default page
