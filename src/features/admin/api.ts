import { getBrowserClient } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

export type AdminDashboardMetrics = {
  activeLaundries: number;
  laundriesGrowthPct: number;
  totalRevenue: number;
  revenueGrowthPct: number;
  activeUsers: number;
  retention30dPct: number;
  recurrentRevenue: number;
  retention90dPct: number;
  retentionTrendPct: number;
  planSnapshot: Array<{
    name: 'Freemium' | 'Suscripción' | 'Comisión';
    accounts: number;
    conversionPct: number;
  }>;
  productEngagement: {
    conversionRatePct: number;
    mobileUsagePct: number;
  };
  operationsSummary: {
    supportSlaPct: number;
    automationsActive: number;
    q4GoalPct: number;
  };
};

const toISODate = (date: Date) => date.toISOString();

const calculateGrowth = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

export const fetchAdminDashboardMetrics = async (): Promise<AdminDashboardMetrics> => {
  const supabase = getBrowserClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOf30DaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOf90DaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const [
    laundriesTotalRes,
    laundriesCurrentRes,
    laundriesPrevRes,
    ordersCurrentRes,
    ordersPrevRes,
    ordersAllRes,
    activeUsersRes,
    retentionUsersRes,
    retention90Res,
  ] = await Promise.all([
    supabase
      .from('lavanderias')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('lavanderias')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', toISODate(startOfMonth)),
    supabase
      .from('lavanderias')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', toISODate(startOfPrevMonth))
      .lt('created_at', toISODate(startOfMonth)),
    supabase
      .from('pedidos')
      .select('total, created_at')
      .gte('created_at', toISODate(startOfMonth)),
    supabase
      .from('pedidos')
      .select('total, created_at')
      .gte('created_at', toISODate(startOfPrevMonth))
      .lt('created_at', toISODate(startOfMonth)),
    supabase.from('pedidos').select('total'),
    supabase
      .from('roles_app')
      .select('id', { count: 'exact', head: true })
      .eq('rol', 'cliente')
      .eq('activo', true),
    supabase
      .from('roles_app')
      .select('id', { count: 'exact', head: true })
      .eq('rol', 'cliente')
      .eq('activo', true)
      .gte('updated_at', toISODate(startOf30DaysAgo)),
    supabase
      .from('roles_app')
      .select('id', { count: 'exact', head: true })
      .eq('rol', 'cliente')
      .eq('activo', true)
      .gte('updated_at', toISODate(startOf90DaysAgo)),
  ]);

  const handleError = (...responses: Array<{ error: Error | null }>) => {
    const responseWithError = responses.find((response) => response.error);
    if (responseWithError?.error) {
      throw responseWithError.error;
    }
  };

  handleError(
    laundriesTotalRes,
    laundriesCurrentRes,
    laundriesPrevRes,
    ordersCurrentRes,
    ordersPrevRes,
    ordersAllRes,
    activeUsersRes,
    retentionUsersRes,
    retention90Res,
  );

  const toNumber = (value: number | null | undefined) => (typeof value === 'number' ? value : 0);

  const activeLaundries = toNumber(laundriesTotalRes.count);
  const laundriesCurrent = toNumber(laundriesCurrentRes.count);
  const laundriesPrev = toNumber(laundriesPrevRes.count);
  const laundriesGrowthPct = calculateGrowth(laundriesCurrent, laundriesPrev);

  const sumTotals = (rows: Array<{ total: number | null }>) =>
    rows.reduce((acc, row) => acc + (row.total ?? 0), 0);

  type PedidoRow = Database['public']['Tables']['pedidos']['Row'];

  const revenueCurrent = ordersCurrentRes.data
    ? sumTotals(ordersCurrentRes.data as Pick<PedidoRow, 'total'>[])
    : 0;
  const revenuePrev = ordersPrevRes.data
    ? sumTotals(ordersPrevRes.data as Pick<PedidoRow, 'total'>[])
    : 0;
  const totalRevenue = ordersAllRes.data
    ? sumTotals(ordersAllRes.data as Pick<PedidoRow, 'total'>[])
    : 0;
  const revenueGrowthPct = calculateGrowth(revenueCurrent, revenuePrev);

  const activeUsers = toNumber(activeUsersRes.count);
  const retentionUsers = toNumber(retentionUsersRes.count);
  const retention90Users = toNumber(retention90Res.count);

  const retention30dPct = activeUsers > 0 ? (retentionUsers / activeUsers) * 100 : 0;
  const retention90dPct = activeUsers > 0 ? (retention90Users / activeUsers) * 100 : 0;

  return {
    activeLaundries,
    laundriesGrowthPct,
    totalRevenue,
    revenueGrowthPct,
    activeUsers,
    retention30dPct,
    recurrentRevenue: revenueCurrent,
    retention90dPct,
    retentionTrendPct: revenueGrowthPct,
    planSnapshot: [
      { name: 'Freemium', accounts: 0, conversionPct: 0 },
      { name: 'Suscripción', accounts: 0, conversionPct: 0 },
      { name: 'Comisión', accounts: 0, conversionPct: 0 },
    ],
    productEngagement: {
      conversionRatePct: 0,
      mobileUsagePct: 0,
    },
    operationsSummary: {
      supportSlaPct: 0,
      automationsActive: 0,
      q4GoalPct: 0,
    },
  };
};
