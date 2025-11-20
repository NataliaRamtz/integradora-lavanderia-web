import { z } from 'zod';
import type { Database } from '@/lib/supabase/database.types';

export type TicketRow = Database['public']['Tables']['tickets']['Row'];

export const ticketSchema = z.object({
  pedido_id: z.string(),
  lavanderia_id: z.string(),
  pin_hash: z.string(),
  qr_ref: z.string().nullable(),
  validado: z.boolean(),
  intentos: z.number(),
  last_try_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Ticket = z.infer<typeof ticketSchema>;

export const ticketCollectionSchema = z.array(ticketSchema);

export type TicketCollection = z.infer<typeof ticketCollectionSchema>;

