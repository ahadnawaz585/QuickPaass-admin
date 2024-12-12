import React, { useEffect, useState, Suspense } from 'react';
import { permission } from '@/auth/access.service';
import Loader from '../shared/loader/loader';
const Authorized = React.lazy(() => import('@/components/shared/authorized/authorized'));

const withPermission = (WrappedComponent: React.FC | React.FC<any>, feature: string) => {
  const ComponentWithPermission = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkPermission = async () => {
        try {
          const permissionResult = await permission(feature);
          setHasPermission(permissionResult);
        } catch (error) {
          console.error('Error checking permission:', error);
          setHasPermission(false);
        } finally {
          setLoading(false);
        }
      };

      checkPermission();
    }, []);

    if (loading) {
      return <Loader />;
    }

    if (!hasPermission) {
      return (
        <Suspense fallback={<Loader />}>
          <Authorized />
        </Suspense>
      );
    }

    return (<WrappedComponent />);
  };

  ComponentWithPermission.displayName = `withPermission(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithPermission;
};

export default withPermission;
