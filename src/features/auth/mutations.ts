import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { getBrowserClient } from '@/lib/supabase';
import { queryKeys } from '@/lib/query-client';
import { upsertPerfil } from './api';

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Ingresa un correo válido',
  }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const usePasswordLogin = () => {
  const supabase = getBrowserClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: LoginInput) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
    },
  });
};

export type UpdatePerfilInput = {
  authUserId: string;
  email: string;
  currentEmail: string;
  perfil: Record<string, unknown>;
  preferencias?: Record<string, unknown>;
};

export const useUpdatePerfil = () => {
  const supabase = getBrowserClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ authUserId, email, currentEmail, perfil, preferencias }: UpdatePerfilInput) => {
      if (!authUserId) {
        throw new Error('No encontramos el usuario de la sesión.');
      }

      if (email !== currentEmail) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) {
          throw emailError;
        }
      }

      await upsertPerfil({ authUserId, perfil, preferencias });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.perfil.byAuthUser(variables.authUserId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
    },
  });
};

export type UpdatePasswordInput = {
  email: string;
  currentPassword: string;
  newPassword: string;
};

export const useUpdatePassword = () => {
  const supabase = getBrowserClient();

  return useMutation({
    mutationFn: async ({ email, currentPassword, newPassword }: UpdatePasswordInput) => {
      if (!email) {
        throw new Error('No encontramos el correo actual. Vuelve a iniciar sesión.');
      }

      if (!currentPassword) {
        throw new Error('Ingresa tu contraseña actual.');
      }

      if (!newPassword) {
        throw new Error('La nueva contraseña no puede estar vacía.');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('La contraseña actual es incorrecta.');
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        throw updateError;
      }
    },
  });
};

