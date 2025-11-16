import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import { updateAdminUser, type UpdateAdminUserInput } from './api';

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAdminUserInput) => updateAdminUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, 'users'] });
    },
  });
};
