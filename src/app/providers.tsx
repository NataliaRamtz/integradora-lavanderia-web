'use client';

import type { PropsWithChildren } from 'react';
import { ReactQueryProvider } from '@/components/providers/react-query-provider';
import { SessionProvider } from '@/features/auth/session-context';

export const Providers = ({ children }: PropsWithChildren) => (
  <ReactQueryProvider>
    <SessionProvider>{children}</SessionProvider>
  </ReactQueryProvider>
);

