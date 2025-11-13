import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import {
  createServicio,
  fetchServicios,
  fetchServiciosResumen,
  toggleServicioActivo,
  updateServicio,
} from './api';

export const useServiciosResumen = (
  lavanderiaId?: string,
  options?: { limit?: number }
) =>
  useQuery({
    queryKey: [...queryKeys.servicios.lists(), lavanderiaId, 'resumen', options?.limit],
    queryFn: () =>
      fetchServiciosResumen({
        lavanderiaId: lavanderiaId as string,
        limit: options?.limit,
      }),
    enabled: Boolean(lavanderiaId),
    staleTime: 60_000,
  });

export const useServicios = (lavanderiaId?: string) =>
  useQuery({
    queryKey: queryKeys.servicios.list(lavanderiaId ?? '', {}),
    queryFn: () => fetchServicios({ lavanderiaId: lavanderiaId as string }),
    enabled: Boolean(lavanderiaId),
    staleTime: 60_000,
  });

export const useCreateServicio = (lavanderiaId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createServicio>[0]['data']) =>
      createServicio({ lavanderiaId: lavanderiaId as string, data }),
    onSuccess: () => {
      if (!lavanderiaId) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.servicios.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.servicios.list(lavanderiaId, {}) });
    },
  });
};

export const useUpdateServicio = (lavanderiaId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ servicioId, data }: { servicioId: string; data: Parameters<typeof updateServicio>[0]['data'] }) =>
      updateServicio({ servicioId, data }),
    onSuccess: () => {
      if (!lavanderiaId) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.servicios.list(lavanderiaId, {}) });
      queryClient.invalidateQueries({ queryKey: queryKeys.servicios.lists() });
    },
  });
};

export const useToggleServicioActivo = (lavanderiaId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ servicioId, activo }: { servicioId: string; activo: boolean }) =>
      toggleServicioActivo({ servicioId, activo }),
    onSuccess: () => {
      if (!lavanderiaId) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.servicios.list(lavanderiaId, {}) });
      queryClient.invalidateQueries({ queryKey: queryKeys.servicios.lists() });
    },
  });
};
