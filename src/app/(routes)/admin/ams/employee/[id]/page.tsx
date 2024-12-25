import Loader from '@/components/shared/loader/loader';
import React, { Suspense } from 'react'
const DetailedEmployeeComponent = React.lazy(() => import('@/modules/AMS/pages/employees/detailed/detailedEmployee'));

const page = () => {
  return (
    <Suspense fallback={<Loader />}><DetailedEmployeeComponent /></Suspense>
  )
}

export default page
