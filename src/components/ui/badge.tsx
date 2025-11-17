'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { PedidoEstado } from '@/features/pedidos/constants';

const estadoStyles: Record<PedidoEstado, string> = {
  creado: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
  en_proceso: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  listo: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  entregado: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
  cancelado: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
};

const estadoLabels: Record<PedidoEstado, string> = {
  creado: 'Creado',
  en_proceso: 'En proceso',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  estado?: PedidoEstado;
};

export const Badge = ({ className, estado, children, ...props }: BadgeProps) => {
  const isEstado = estado && estado in estadoStyles;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide',
        isEstado ? estadoStyles[estado!] : 'bg-slate-800 text-slate-200',
        className
      )}
      {...props}
    >
      {estado ? estadoLabels[estado] : children}
    </span>
  );
};

