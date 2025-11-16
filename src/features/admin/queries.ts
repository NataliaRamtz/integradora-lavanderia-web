import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import { fetchAdminDashboardMetrics } from './api';

export const useAdminDashboardMetrics = () =>
  useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: fetchAdminDashboardMetrics,
    staleTime: 5 * 60 * 1000,
  });
