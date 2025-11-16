import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import {
  createWalkInPedido,
  fetchPedidoDetalle,
  fetchPedidosDashboardResumen,
  fetchPedidosList,
  fetchPedidosPorEstado,
  updatePedidoEstado,
} from './api';
import type { PedidoEstado } from './constants';

export const usePedidosPorEstado = (
  lavanderiaId?: string,
  estados?: PedidoEstado[]
) =>
  useQuery({
    queryKey: queryKeys.pedidos.byLavanderia(lavanderiaId ?? '', { estados }),
    queryFn: () =>
      fetchPedidosPorEstado({
        lavanderiaId: lavanderiaId as string,
        estados,
      }),
    enabled: Boolean(lavanderiaId),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

export const usePedidosDashboardResumen = (lavanderiaId?: string) =>
  useQuery({
    queryKey: queryKeys.pedidos.dashboard(lavanderiaId ?? ''),
    queryFn: () =>
      fetchPedidosDashboardResumen({ lavanderiaId: lavanderiaId as string }),
    enabled: Boolean(lavanderiaId),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

export const usePedidosList = (
  lavanderiaId?: string,
  options?: { estado?: PedidoEstado | 'todos'; search?: string }
) =>
  useQuery({
    queryKey: queryKeys.pedidos.list(lavanderiaId ?? '', options ?? {}),
    queryFn: () =>
      fetchPedidosList({
        lavanderiaId: lavanderiaId as string,
        estado: options?.estado,
        search: options?.search,
      }),
    enabled: Boolean(lavanderiaId),
    staleTime: 30_000,
  });

export const usePedidoDetalle = (lavanderiaId?: string, pedidoId?: string) =>
  useQuery({
    queryKey: queryKeys.pedidos.detail(`${lavanderiaId ?? ''}:${pedidoId ?? ''}`),
    queryFn: () =>
      fetchPedidoDetalle({
        lavanderiaId: lavanderiaId as string,
        pedidoId: pedidoId as string,
      }),
    enabled: Boolean(lavanderiaId && pedidoId),
    staleTime: 15_000,
  });

export const useUpdatePedidoEstado = (lavanderiaId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pedidoId, estado }: { pedidoId: string; estado: PedidoEstado }) =>
      updatePedidoEstado({ lavanderiaId: lavanderiaId as string, pedidoId, estado }),
    onSuccess: (_, variables) => {
      if (!lavanderiaId) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.pedidos.dashboard(lavanderiaId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pedidos.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pedidos.detail(`${lavanderiaId}:${variables.pedidoId}`),
      });
    },
  });
};

export const useCreateWalkInPedido = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWalkInPedido,
    onSuccess: (_, variables) => {
      const lavanderiaId = variables.lavanderiaId;
      queryClient.invalidateQueries({
        queryKey: queryKeys.pedidos.dashboard(lavanderiaId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pedidos.lists(),
      });
    },
  });
};

