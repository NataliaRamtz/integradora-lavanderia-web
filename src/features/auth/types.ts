import type { PerfilApp, RolApp } from './schemas';

export type SessionStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

export type PriorityRole = 'superadmin' | 'encargado' | 'repartidor' | 'cliente';

export interface SessionData {
  authUserId: string;
  email: string;
  perfil: PerfilApp;
  roles: RolApp[];
  isAuthenticated: boolean;
}

export interface LoadingState {
  auth: boolean;
  perfil: boolean;
  roles: boolean;
}

