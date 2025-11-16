import type { QueryClientConfig } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';

const defaultConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 0,
    },
  },
};

let client: QueryClient | null = null;

export const getQueryClient = () => {
  if (!client) {
    client = new QueryClient(defaultConfig);
  }
  return client;
};

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
  perfil: {
    all: ['perfil'] as const,
    byAuthUser: (authUserId: string) =>
      [...queryKeys.perfil.all, authUserId] as const,
    byId: (perfilId: string) =>
      [...queryKeys.perfil.all, 'id', perfilId] as const,
  },
  roles: {
    all: ['roles'] as const,
    byPerfil: (perfilId: string) =>
      [...queryKeys.roles.all, perfilId] as const,
    byLavanderia: (lavanderiaId: string) =>
      [...queryKeys.roles.all, 'lavanderia', lavanderiaId] as const,
  },
  lavanderias: {
    all: ['lavanderias'] as const,
    lists: () => [...queryKeys.lavanderias.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.lavanderias.lists(), filters] as const,
    details: () => [...queryKeys.lavanderias.all, 'detail'] as const,
    detail: (id: string) =>
      [...queryKeys.lavanderias.details(), id] as const,
    nearby: (coords: { lat: number; lng: number }, radius?: number) =>
      [...queryKeys.lavanderias.all, 'nearby', coords, radius] as const,
  },
  servicios: {
    all: ['servicios'] as const,
    lists: () => [...queryKeys.servicios.all, 'list'] as const,
    list: (lavanderiaId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.servicios.lists(), lavanderiaId, filters] as const,
    detail: (id: string) =>
      [...queryKeys.servicios.all, 'detail', id] as const,
    byCategoria: (lavanderiaId: string, categoria: string) =>
      [
        ...queryKeys.servicios.all,
        'categoria',
        lavanderiaId,
        categoria,
      ] as const,
  },
  pedidos: {
    all: ['pedidos'] as const,
    lists: () => [...queryKeys.pedidos.all, 'list'] as const,
    list: (userId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.pedidos.lists(), userId, filters] as const,
    details: () => [...queryKeys.pedidos.all, 'detail'] as const,
    detail: (id: string) =>
      [...queryKeys.pedidos.details(), id] as const,
    byLavanderia: (lavanderiaId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.pedidos.all, 'lavanderia', lavanderiaId, filters] as const,
    byEstado: (userId: string, estado: string) =>
      [...queryKeys.pedidos.all, 'estado', userId, estado] as const,
    dashboard: (lavanderiaId: string) =>
      [...queryKeys.pedidos.all, 'dashboard', lavanderiaId] as const,
  },
  notificaciones: {
    all: ['notificaciones'] as const,
    list: (userId: string) =>
      [...queryKeys.notificaciones.all, userId] as const,
    unreadCount: (userId: string) =>
      [...queryKeys.notificaciones.all, 'unread', userId] as const,
  },
  estadisticas: {
    all: ['estadisticas'] as const,
    dashboard: (lavanderiaId: string) =>
      [...queryKeys.estadisticas.all, 'dashboard', lavanderiaId] as const,
  },
  admin: {
    all: ['admin'] as const,
    dashboard: () => [...queryKeys.admin.all, 'dashboard'] as const,
  },
} as const;

