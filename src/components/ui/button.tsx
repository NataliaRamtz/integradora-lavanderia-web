'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-slate-900';

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-sky-500 text-white hover:bg-sky-400',
  secondary: 'bg-slate-700 text-slate-100 hover:bg-slate-600',
  outline:
    'border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800',
  ghost: 'bg-transparent text-slate-100 hover:bg-slate-800',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      const sanitizedChildren = React.Children.toArray(children).filter((child) => {
        if (typeof child === 'string') {
          return child.trim().length > 0;
        }
        return true;
      });

      const child = sanitizedChildren[0];

      if (!React.isValidElement(child)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Button with `asChild` expects a single valid React element as a child.');
        }
        return null;
      }

      return (
        <Slot
          ref={ref}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {child}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

