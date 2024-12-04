import React, { Suspense } from 'react';

const LoginForm = React.lazy(() => import('@/pages/login/login'));
import Loader from '@/components/shared/loader/Loader';
const page = () => {
  return (
      <Suspense fallback={<Loader/>}>
        <LoginForm />
      </Suspense>
  );
};

export default page;
