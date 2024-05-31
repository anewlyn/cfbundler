'use client';
import { useQuery } from '@tanstack/react-query';
import { getBundle } from '../queries/get-bundle';

function useBundle() {
  const queryKey = ['bundles']; // Updated to reflect that it fetches all users

  const queryFn = async () => {
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    return await getBundle().then((result: any) => {
      console.log('result: ', result);

      return result;
    });
  };

  return useQuery({ queryKey, queryFn });
}

export default useBundle; // Renamed to reflect its purpose
