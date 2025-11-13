import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import {
  createLavanderia,
  updateLavanderia,
  type AdminUpdateLavanderiaInput,
} from './api';

export const useCreateLavanderia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLavanderia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lavanderias.lists() });
    },
  });
};

export const useUpdateLavanderia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminUpdateLavanderiaInput) => updateLavanderia(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lavanderias.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.lavanderias.detail(variables.id) });
    },
  });
};
