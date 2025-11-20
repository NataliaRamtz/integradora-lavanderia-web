import { getBrowserClient } from '@/lib/supabase';
import type { Database } from '@/lib/supabase/database.types';
import { ticketSchema, ticketCollectionSchema, type Ticket } from './schemas';

type TicketRow = Database['public']['Tables']['tickets']['Row'];

// Generar un PIN numérico de 6 dígitos
const generatePIN = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hashear el PIN usando un método simple (en producción usar bcrypt)
const hashPIN = (pin: string): string => {
  // Usar un hash simple para desarrollo
  // En producción, esto debería usar bcrypt o similar
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convertir a 32bit entero
  }
  return Math.abs(hash).toString(16);
};

// Generar referencia QR única
const generateQRRef = (pedidoId: string): string => {
  return `QR-${pedidoId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
};

export type CreateTicketInput = {
  pedidoId: string;
  lavanderiaId: string;
};

export type CreateTicketOutput = {
  ticket: Ticket;
  pin: string; // El PIN en texto plano (solo se devuelve una vez)
};

export const createTicket = async ({
  pedidoId,
  lavanderiaId,
}: CreateTicketInput): Promise<CreateTicketOutput> => {
  const supabase = getBrowserClient();

  // Generar PIN y hash
  const pin = generatePIN();
  const pinHash = hashPIN(pin);
  const qrRef = generateQRRef(pedidoId);

  // Verificar si ya existe un ticket para este pedido
  const { data: existingTicket } = await supabase
    .from('tickets')
    .select('*')
    .eq('pedido_id', pedidoId)
    .single();

  let ticketRow: TicketRow;

  if (existingTicket) {
    // Si existe, actualizar el ticket con nuevo PIN y QR
    const { data, error } = await supabase
      .from('tickets')
      .update({
        pin_hash: pinHash,
        qr_ref: qrRef,
        intentos: 0,
        validado: false,
        last_try_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('pedido_id', pedidoId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    ticketRow = data as TicketRow;
  } else {
    // Crear nuevo ticket
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        pedido_id: pedidoId,
        lavanderia_id: lavanderiaId,
        pin_hash: pinHash,
        qr_ref: qrRef,
        validado: false,
        intentos: 0,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    ticketRow = data as TicketRow;
  }

  const ticket = ticketSchema.parse(ticketRow);

  return {
    ticket,
    pin,
  };
};

export type FetchTicketsInput = {
  lavanderiaId: string;
  pedidoId?: string;
};

export const fetchTickets = async ({
  lavanderiaId,
  pedidoId,
}: FetchTicketsInput): Promise<Ticket[]> => {
  const supabase = getBrowserClient();

  let query = supabase
    .from('tickets')
    .select('*')
    .eq('lavanderia_id', lavanderiaId)
    .order('created_at', { ascending: false });

  if (pedidoId) {
    query = query.eq('pedido_id', pedidoId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return ticketCollectionSchema.parse(data ?? []);
};

export const fetchTicketByPedidoId = async (
  pedidoId: string
): Promise<Ticket | null> => {
  const supabase = getBrowserClient();

  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('pedido_id', pedidoId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No encontrado
      return null;
    }
    throw error;
  }

  return ticketSchema.parse(data);
};

