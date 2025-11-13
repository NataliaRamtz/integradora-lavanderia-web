import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { fetchEstadisticasDashboard } from './api';

export const useEstadisticasDashboard = (lavanderiaId?: string) =>
  useQuery({
    queryKey: lavanderiaId
      ? queryKeys.estadisticas.dashboard(lavanderiaId)
      : [...queryKeys.estadisticas.all, 'dashboard'],
    queryFn: () => fetchEstadisticasDashboard(lavanderiaId as string),
    enabled: Boolean(lavanderiaId),
    staleTime: 60_000,
  });
