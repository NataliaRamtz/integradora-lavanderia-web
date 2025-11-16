'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminConfiguracionPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [config, setConfig] = useState({
    appName: 'LaundryPro',
    supportEmail: 'soporte@laundrypro.com',
    maxLaundries: '30',
    emailNotifications: true,
    systemAlerts: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    try {
      // Aquí iría la lógica para guardar en la base de datos
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage('Configuración guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-widest dark:text-slate-500 text-slate-600">Dashboard ▸ Configuración</p>
        <h1 className="text-3xl font-semibold dark:text-slate-50 text-slate-900">Configuración del Sistema</h1>
        <p className="text-sm dark:text-slate-400 text-slate-600">
          Ajustes globales y parámetros de configuración de la plataforma.
        </p>
      </header>

      <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
        <CardHeader>
          <CardTitle className="dark:text-slate-100 text-slate-900">Configuración General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="appName" className="dark:text-slate-200 text-slate-700">
              Nombre de la aplicación
            </Label>
            <Input
              id="appName"
              value={config.appName}
              onChange={(e) => setConfig({ ...config, appName: e.target.value })}
              className="dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 border-slate-300 bg-white text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportEmail" className="dark:text-slate-200 text-slate-700">
              Email de soporte
            </Label>
            <Input
              id="supportEmail"
              type="email"
              value={config.supportEmail}
              onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
              className="dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 border-slate-300 bg-white text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxLaundries" className="dark:text-slate-200 text-slate-700">
              Límite de lavanderías por cuenta
            </Label>
            <Input
              id="maxLaundries"
              type="number"
              value={config.maxLaundries}
              onChange={(e) => setConfig({ ...config, maxLaundries: e.target.value })}
              className="dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 border-slate-300 bg-white text-slate-900"
            />
          </div>

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm dark:text-emerald-200 text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-sky-500 text-white hover:bg-sky-600"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar configuración
          </Button>
        </CardContent>
      </Card>

      <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
        <CardHeader>
          <CardTitle className="dark:text-slate-100 text-slate-900">Configuración de Notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border dark:border-white/10 border-slate-200 dark:bg-slate-950/60 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold dark:text-slate-100 text-slate-900">Notificaciones por email</p>
              <p className="text-xs dark:text-slate-400 text-slate-600">Enviar notificaciones importantes por correo electrónico</p>
            </div>
            <input
              type="checkbox"
              checked={config.emailNotifications}
              onChange={(e) => setConfig({ ...config, emailNotifications: e.target.checked })}
              className="h-4 w-4 rounded dark:border-slate-700 dark:bg-slate-900 border-slate-300 bg-white text-sky-500"
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl border dark:border-white/10 border-slate-200 dark:bg-slate-950/60 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold dark:text-slate-100 text-slate-900">Alertas de sistema</p>
              <p className="text-xs dark:text-slate-400 text-slate-600">Recibir alertas sobre eventos importantes del sistema</p>
            </div>
            <input
              type="checkbox"
              checked={config.systemAlerts}
              onChange={(e) => setConfig({ ...config, systemAlerts: e.target.checked })}
              className="h-4 w-4 rounded dark:border-slate-700 dark:bg-slate-900 border-slate-300 bg-white text-sky-500"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
