import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPerfil, fetchRoles } from './api';
import { queryKeys } from '@/lib/query-client';
import { getBrowserClient } from '@/lib/supabase';

export const usePerfil = (authUserId: string | null) =>
  useQuery({
    queryKey: queryKeys.perfil.byAuthUser(authUserId ?? ''),
    queryFn: () => fetchPerfil(authUserId!),
    enabled: !!authUserId,
    staleTime: 5 * 60 * 1000,
  });

export const useRoles = (authUserId: string | null) =>
  useQuery({
    queryKey: queryKeys.roles.byPerfil(authUserId ?? ''),
    queryFn: () => fetchRoles(authUserId!),
    enabled: !!authUserId,
    staleTime: 10 * 60 * 1000,
  });

export const useSupabaseSignOut = () => {
  const queryClient = useQueryClient();
  const supabase = getBrowserClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

