import Loader from '@/components/shared/loader/loader';
import React, { Suspense } from 'react'
const EmployeeComponent = React.lazy(() => import('@/modules/AMS/pages/employees/employees'));

const page = () => {
  return (
    <p>ams</p>
  )
}

export default page
