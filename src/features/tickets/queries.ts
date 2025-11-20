import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { fetchTickets, fetchTicketByPedidoId } from './api';

export const useTickets = (lavanderiaId?: string, pedidoId?: string) =>
  useQuery({
    queryKey: queryKeys.tickets.list(lavanderiaId ?? '', pedidoId),
    queryFn: () =>
      fetchTickets({
        lavanderiaId: lavanderiaId as string,
        pedidoId,
      }),
    enabled: Boolean(lavanderiaId),
    staleTime: 30_000,
  });

export const useTicketByPedidoId = (pedidoId?: string) =>
  useQuery({
    queryKey: queryKeys.tickets.byPedidoId(pedidoId ?? ''),
    queryFn: () => fetchTicketByPedidoId(pedidoId as string),
    enabled: Boolean(pedidoId),
    staleTime: 30_000,
  });

