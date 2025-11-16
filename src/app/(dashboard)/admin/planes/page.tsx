'use client';

import { useState } from 'react';
import { useAdminDashboardMetrics } from '@/features/admin/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Edit2, Save, X } from 'lucide-react';

const formatNumber = (value: number) => new Intl.NumberFormat('es-MX').format(value);
const formatPct = (value: number) => `${value.toFixed(1)}%`;

export default function AdminPlanesPage() {
  const { data, isLoading } = useAdminDashboardMetrics();
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editedAccounts, setEditedAccounts] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  const plans = data?.planSnapshot ?? [
    { name: 'Freemium' as const, accounts: 0, conversionPct: 0 },
    { name: 'Suscripción' as const, accounts: 0, conversionPct: 0 },
    { name: 'Comisión' as const, accounts: 0, conversionPct: 0 },
  ];

  const handleEdit = (planName: string, currentAccounts: number) => {
    setEditingPlan(planName);
    setEditedAccounts({ ...editedAccounts, [planName]: currentAccounts });
  };

  const handleCancel = () => {
    setEditingPlan(null);
    setEditedAccounts({});
  };

  const handleSave = async (planName: string) => {
    setIsSaving(true);
    try {
      // Aquí iría la lógica para guardar los cambios en la base de datos
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEditingPlan(null);
      setEditedAccounts({});
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-widest dark:text-slate-500 text-slate-600">Dashboard ▸ Gestión de Planes</p>
        <h1 className="text-3xl font-semibold dark:text-slate-50 text-slate-900">Gestión de Planes</h1>
        <p className="text-sm dark:text-slate-400 text-slate-600">
          Administra y monitorea los planes de suscripción de las lavanderías registradas.
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border dark:border-white/10 border-slate-200 dark:bg-slate-900/60 bg-white/80 py-20 dark:text-slate-400 text-slate-600">
          <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Cargando información de planes…
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isEditing = editingPlan === plan.name;
            const editedValue = editedAccounts[plan.name] ?? plan.accounts;

            return (
              <Card key={plan.name} className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="dark:text-slate-100 text-slate-900">{plan.name}</CardTitle>
                    {!isEditing ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(plan.name, plan.accounts)}
                        className="h-8 w-8 p-0 dark:text-slate-400 text-slate-600 hover:dark:text-sky-300 hover:text-sky-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSave(plan.name)}
                          disabled={isSaving}
                          className="h-8 w-8 p-0 dark:text-emerald-400 text-emerald-600 hover:dark:text-emerald-300 hover:text-emerald-700"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="h-8 w-8 p-0 dark:text-rose-400 text-rose-600 hover:dark:text-rose-300 hover:text-rose-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest dark:text-slate-500 text-slate-600">Cuentas activas</p>
                    {isEditing ? (
                      <div className="mt-2">
                        <Input
                          type="number"
                          value={editedValue}
                          onChange={(e) => setEditedAccounts({ ...editedAccounts, [plan.name]: parseInt(e.target.value) || 0 })}
                          className="dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 border-slate-300 bg-white text-slate-900"
                        />
                      </div>
                    ) : (
                      <p className="mt-2 text-3xl font-semibold dark:text-slate-50 text-slate-900">{formatNumber(plan.accounts)}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest dark:text-slate-500 text-slate-600">Tasa de conversión</p>
                    <p className="mt-2 text-2xl font-semibold text-sky-200 dark:text-sky-200 text-sky-600">{formatPct(plan.conversionPct)}</p>
                  </div>
                  <div className="rounded-2xl border dark:border-white/10 border-slate-200 dark:bg-slate-950/60 bg-slate-50 p-4">
                    <p className="text-xs dark:text-slate-400 text-slate-600">
                      {plan.name === 'Freemium' && 'Plan gratuito con funcionalidades básicas.'}
                      {plan.name === 'Suscripción' && 'Plan de suscripción mensual con todas las funciones.'}
                      {plan.name === 'Comisión' && 'Plan basado en comisión por transacción.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
        <CardHeader>
          <CardTitle className="dark:text-slate-100 text-slate-900">Resumen de planes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm dark:text-slate-400 text-slate-600">
            La gestión de planes permite monitorear la distribución de lavanderías entre los diferentes modelos de negocio.
            Esta información ayuda a tomar decisiones estratégicas sobre precios y características de cada plan.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
