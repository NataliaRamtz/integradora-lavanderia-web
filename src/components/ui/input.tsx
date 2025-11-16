'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-offset-slate-950',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
