import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import { fetchAdminUsers } from './api';

export const useAdminUsers = () =>
  useQuery({
    queryKey: [...queryKeys.admin.all, 'users'],
    queryFn: fetchAdminUsers,
    staleTime: 60 * 1000,
  });
