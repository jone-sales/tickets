import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-lg shadow text-center">
      <p className="text-gray-700">Signing you out...</p>
    </div>
  );
};