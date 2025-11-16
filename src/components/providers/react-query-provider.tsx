'use client';

import { QueryClientProvider, HydrationBoundary, type DehydratedState } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type PropsWithChildren, useState } from 'react';
import { getQueryClient } from '@/lib/query-client';

type ReactQueryProviderProps = PropsWithChildren<{
  state?: DehydratedState;
}>;

export const ReactQueryProvider = ({ state, children }: ReactQueryProviderProps) => {
  const [client] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={client}>
      <HydrationBoundary state={state}>{children}</HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
};

