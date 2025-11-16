'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session, AuthChangeEvent, User } from '@supabase/supabase-js';
import { getBrowserClient } from '@/lib/supabase';
import { usePerfil, useRoles } from './queries';
import type { PerfilApp, RolApp } from './schemas';
import type {
  LoadingState,
  PriorityRole,
  SessionData,
  SessionStatus,
} from './types';

interface SessionContextType {
  status: SessionStatus;
  loadingState: LoadingState;
  session: SessionData | null;
  user: User | null;
  authUserId: string | null;
  perfil: PerfilApp | null;
  roles: RolApp[];
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPerfilLoaded: boolean;
  hasRolesLoaded: boolean;
  primaryRole: PriorityRole;
  activeRole: RolApp | null;
  setActiveRole: (roleId: string) => void;
  hasRole: (rol: RolApp['rol'], lavanderiaId?: string) => boolean;
  getRoleForLavanderia: (lavanderiaId: string) => RolApp | null;
  isGlobalAdmin: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | null>(null);

const getPriorityRole = (roles: RolApp[]): PriorityRole => {
  if (!roles.length) return 'cliente';
  if (roles.some((r) => r.rol === 'superadmin' && r.activo && !r.lavanderia_id)) {
    return 'superadmin';
  }
  if (roles.some((r) => r.rol === 'encargado' && r.activo)) {
    return 'encargado';
  }
  if (roles.some((r) => r.rol === 'repartidor' && r.activo)) {
    return 'repartidor';
  }
  return 'cliente';
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = useMemo(() => getBrowserClient(), []);

  const [status, setStatus] = useState<SessionStatus>('idle');
  const [user, setUser] = useState<User | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);

  const perfilQuery = usePerfil(authUserId);
  const rolesQuery = useRoles(authUserId);

  const handleSession = useCallback((session: Session | null) => {
    if (session?.user) {
      setUser(session.user);
      setAuthUserId(session.user.id);
      setStatus('loading');
    } else {
      setUser(null);
      setAuthUserId(null);
      setActiveRoleId(null);
      setStatus('unauthenticated');
    }
  }, []);

  const loadingState: LoadingState = {
    auth: status === 'idle' || status === 'loading',
    perfil: perfilQuery.isLoading,
    roles: rolesQuery.isLoading,
  };

  const isLoading = loadingState.auth || loadingState.perfil || loadingState.roles;

  useEffect(() => {
    const loadInitialSession = async () => {
      setStatus('loading');
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('[Auth] Error al obtener sesión inicial', error);
          setStatus('error');
          return;
        }

        handleSession(session);
      } catch (error) {
        console.error('[Auth] Excepción al obtener sesión inicial', error);
        setStatus('error');
      }
    };

    loadInitialSession();
  }, [handleSession, supabase]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        handleSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [handleSession, supabase]);

  useEffect(() => {
    if (!authUserId) {
      return;
    }

    if (perfilQuery.isError || rolesQuery.isError) {
      setStatus('error');
      return;
    }

    if (perfilQuery.isLoading || rolesQuery.isLoading) {
      setStatus('loading');
      return;
    }

    setStatus('authenticated');
  }, [authUserId, perfilQuery.isError, perfilQuery.isLoading, rolesQuery.isError, rolesQuery.isLoading]);

  const roles = useMemo(() => rolesQuery.data ?? [], [rolesQuery.data]);
  const perfil = perfilQuery.data ?? null;

  const primaryRole = useMemo(() => getPriorityRole(roles), [roles]);

  const activeRole = useMemo(() => {
    if (activeRoleId) {
      return roles.find((role) => role.id === activeRoleId) ?? null;
    }

    return roles.find((role) => role.rol === primaryRole && role.activo) ?? null;
  }, [activeRoleId, primaryRole, roles]);

  const hasPerfilLoaded = !!perfil;
  const hasRolesLoaded = !rolesQuery.isLoading;
  const isAuthenticated = status === 'authenticated' && !!user;
  const isGlobalAdmin = roles.some(
    (role) => role.rol === 'superadmin' && role.activo && !role.lavanderia_id
  );

  const setActiveRole = useCallback(
    (roleId: string) => {
      if (roles.some((role) => role.id === roleId)) {
        setActiveRoleId(roleId);
      }
    },
    [roles]
  );

  const hasRole = useCallback(
    (rol: RolApp['rol'], lavanderiaId?: string) =>
      roles.some(
        (role) =>
          role.rol === rol &&
          role.activo &&
          (lavanderiaId ? role.lavanderia_id === lavanderiaId : true)
      ),
    [roles]
  );

  const getRoleForLavanderia = useCallback(
    (lavanderiaId: string) =>
      roles.find((role) => role.lavanderia_id === lavanderiaId && role.activo) ?? null,
    [roles]
  );

  const refreshSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      handleSession(session);
    } catch (error) {
      console.error('[Auth] Error al refrescar sesión', error);
    }
  }, [handleSession, supabase]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setActiveRoleId(null);
  }, [supabase]);

  const sessionData: SessionData | null = useMemo(() => {
    if (!authUserId || !user || !perfil) {
      return null;
    }

    return {
      authUserId,
      email: user.email ?? '',
      perfil,
      roles,
      isAuthenticated: true,
    };
  }, [authUserId, perfil, roles, user]);

  const contextValue: SessionContextType = {
    status,
    loadingState,
    session: sessionData,
    user,
    authUserId,
    perfil,
    roles,
    isAuthenticated,
    isLoading,
    hasPerfilLoaded,
    hasRolesLoaded,
    primaryRole,
    activeRole,
    setActiveRole,
    hasRole,
    getRoleForLavanderia,
    isGlobalAdmin,
    refreshSession,
    signOut,
  };

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession debe usarse dentro de SessionProvider');
  }
  return context;
};

