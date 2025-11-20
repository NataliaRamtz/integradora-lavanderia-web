import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { createTicket, type CreateTicketInput } from './api';

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => createTicket(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.list(variables.lavanderiaId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.byPedidoId(variables.pedidoId),
      });
    },
  });
};

