'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Pencil,
  Plus,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/features/auth/session-context';
import { getBrowserClient } from '@/lib/supabase/browser-client';
import {
  useCreateServicio,
  useServicios,
  useToggleServicioActivo,
  useUpdateServicio,
} from '@/features/servicios/queries';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
});

type FormState = {
  nombre: string;
  descripcion: string;
  unidad: '' | 'pieza' | 'kg' | 'servicio';
  precio: string;
  categoria: '' | 'basico' | 'premium';
  imagenUrl: string;
  orden: string;
  activo: boolean;
};

const emptyForm: FormState = {
  nombre: '',
  descripcion: '',
  unidad: '',
  precio: '',
  categoria: '',
  imagenUrl: '',
  orden: '',
  activo: true,
};

const unidadOptions: Array<{ value: '' | 'pieza' | 'kg' | 'servicio'; label: string }> = [
  { value: '', label: 'Selecciona una unidad' },
  { value: 'pieza', label: 'Por pieza' },
  { value: 'kg', label: 'Por kilogramo' },
  { value: 'servicio', label: 'Por servicio' },
];

const categoriaOptions: Array<{ value: '' | 'basico' | 'premium'; label: string }> = [
  { value: '', label: 'Selecciona una categoría' },
  { value: 'basico', label: 'Básico' },
  { value: 'premium', label: 'Premium' },
];

export default function CatalogoPage() {
  const router = useRouter();
  const { activeRole } = useSession();
  const lavanderiaId = activeRole?.lavanderia_id ?? '';

  const { data: servicios, isLoading, refetch } = useServicios(lavanderiaId);
  const createServicio = useCreateServicio(lavanderiaId);
  const updateServicioMutation = useUpdateServicio(lavanderiaId);
  const toggleServicioMutation = useToggleServicioActivo(lavanderiaId);

  const [formState, setFormState] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const sortedServicios = useMemo(() => servicios ?? [], [servicios]);

  const handleEdit = (id: string) => {
    const servicio = servicios?.find((item) => item.id === id);
    if (!servicio) return;

    setEditingId(id);
    setFormError(null);
    setFormSuccess(null);
    setFieldErrors({});
    setTouchedFields({});
    setFormState({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion ?? '',
      unidad: servicio.unidad ?? '',
      precio: String(servicio.precio ?? ''),
      categoria: servicio.categoria ?? '',
      imagenUrl: servicio.imagenUrl ?? '',
      orden: servicio.orden ? String(servicio.orden) : '',
      activo: servicio.activo,
    });
    setSelectedFile(null);
    setImagePreview(servicio.imagenUrl ?? null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormState(emptyForm);
    setFormError(null);
    setFormSuccess(null);
    setFieldErrors({});
    setTouchedFields({});
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setFormError('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('La imagen no debe exceder 5MB.');
      return;
    }

    setSelectedFile(file);
    setFormError(null);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormState((prev) => ({ ...prev, imagenUrl: '' }));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile || !lavanderiaId) return null;

    setUploadingImage(true);
    try {
      const supabase = getBrowserClient();
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${lavanderiaId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('servicios')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Error al subir imagen:', error);
        setFormError('No pudimos subir la imagen. Intenta nuevamente.');
        return null;
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage.from('servicios').getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      setFormError('No pudimos subir la imagen. Intenta nuevamente.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const getFieldError = (fieldName: string, value?: string): string | undefined => {
    switch (fieldName) {
      case 'nombre': {
        const val = value ?? formState.nombre;
        if (!val.trim()) return 'El nombre del servicio es obligatorio';
        return undefined;
      }
      case 'precio': {
        const val = value ?? formState.precio;
        if (!val.trim()) return 'El precio es obligatorio';
        const numero = Number(val);
        if (Number.isNaN(numero)) return 'El precio debe ser un número válido';
        if (numero <= 0) return 'El precio debe ser mayor a 0';
        return undefined;
      }
      case 'unidad': {
        const val = value ?? formState.unidad;
        if (!val) return 'La unidad es obligatoria';
        return undefined;
      }
      case 'categoria': {
        const val = value ?? formState.categoria;
        if (!val) return 'La categoría es obligatoria';
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const collectErrors = () => {
    const errors: Record<string, string> = {};
    (['nombre', 'precio', 'unidad', 'categoria'] as const).forEach((field) => {
      const error = getFieldError(field);
      if (error) {
        errors[field] = error;
      }
    });
    return errors;
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    const errors = collectErrors();
    setFieldErrors((prev) => ({ ...prev, ...errors }));
  };

  const validateForm = () => {
    const errors = collectErrors();
    setFieldErrors(errors);
    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!lavanderiaId) {
      setFormError('Debes tener una lavandería activa.');
      return;
    }

    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setTouchedFields((prev) => ({
        ...prev,
        ...Object.keys(errors).reduce<Record<string, boolean>>((acc, key) => {
          acc[key] = true;
          return acc;
        }, {}),
      }));
      setFormError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setFieldErrors({});

    // Subir imagen si hay un archivo seleccionado
    let imagenUrl = formState.imagenUrl.trim() || undefined;
    if (selectedFile) {
      const uploadedUrl = await uploadImage();
      if (!uploadedUrl) {
        return; // El error ya se mostró en uploadImage
      }
      imagenUrl = uploadedUrl;
    }

    const precio = Number(formState.precio);

    const payload = {
      nombre: formState.nombre.trim(),
      descripcion: formState.descripcion.trim() || undefined,
      unidad: formState.unidad || undefined,
      precio,
      categoria: formState.categoria,
      imagenUrl,
      orden: formState.orden ? Number(formState.orden) : undefined,
      activo: formState.activo,
    };

    try {
      if (editingId) {
        await updateServicioMutation.mutateAsync({ servicioId: editingId, data: payload });
        setFormSuccess('Servicio actualizado correctamente.');
      } else {
        await createServicio.mutateAsync(payload);
        setFormSuccess('Servicio creado correctamente.');
      }
      await refetch();
      handleCancelEdit();
    } catch (error) {
      console.error(error);
      setFormError(
        error instanceof Error
          ? error.message
          : 'No pudimos guardar el servicio. Intenta nuevamente.'
      );
    }
  };

  const handleToggleActivo = async (servicioId: string, activo: boolean) => {
    try {
      await toggleServicioMutation.mutateAsync({ servicioId, activo });
      await refetch();
    } catch (error) {
      console.error(error);
      setFormError('No pudimos cambiar el estado del servicio.');
    }
  };

  if (!lavanderiaId) {
    return (
      <section className="space-y-4">
        <Button variant="ghost" className="text-[#BFC7D3] hover:text-[#F2F5FA]" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Regresar
        </Button>
        <div className="rounded-3xl border-2 border-dashed border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 px-6 py-12 text-center text-sm text-[#BFC7D3] backdrop-blur-md">
          Debes seleccionar una lavandería para administrar los servicios.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2 mb-2">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#F2F5FA] via-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">Catálogo de servicios</h1>
        <p className="text-sm text-[#BFC7D3] font-medium">
          Administra los servicios disponibles en tu lavandería. Puedes activarlos, editarlos o crear nuevos.
        </p>
      </header>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#F2F5FA]">Servicios actuales</h2>
          <p className="text-sm text-[#8FA1B7] font-medium">Total: {servicios?.length ?? 0}</p>
        </header>

        {isLoading ? (
          <div className="rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 px-6 py-10 text-center text-sm text-[#BFC7D3] backdrop-blur-md">
            Cargando servicios…
          </div>
        ) : sortedServicios.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 px-6 py-10 text-center text-sm text-[#BFC7D3] backdrop-blur-md">
            Aún no tienes servicios registrados.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedServicios.map((servicio) => (
              <article
                key={servicio.id}
                className="group relative overflow-hidden flex flex-col gap-4 rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20 hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-extrabold text-[#F2F5FA]">{servicio.nombre}</h3>
                    <p className="mt-1 text-sm font-bold bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">
                      {currencyFormatter.format(servicio.precio)}
                      {servicio.unidad ? <span className="text-[#8FA1B7] font-normal"> / {servicio.unidad}</span> : ''}
                    </p>
                  </div>
                  <BadgeEstado activo={servicio.activo} />
                </div>

                {servicio.descripcion ? (
                  <p className="relative text-sm text-[#BFC7D3] leading-relaxed">{servicio.descripcion}</p>
                ) : null}
                <div className="relative grid gap-1 text-xs text-[#8FA1B7]">
                  {servicio.categoria ? <p>Categoría: <span className="text-[#BFC7D3] font-medium">{servicio.categoria}</span></p> : null}
                  {servicio.orden ? <p>Orden: <span className="text-[#BFC7D3] font-medium">{servicio.orden}</span></p> : null}
                  {servicio.createdAt ? (
                    <p>
                      Creado: <span className="text-[#BFC7D3] font-medium">{new Date(servicio.createdAt).toLocaleDateString('es-MX', { dateStyle: 'medium' })}</span>
                    </p>
                  ) : null}
                </div>

                <div className="relative flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    className="border-2 border-[#25354B] bg-transparent text-xs text-[#BFC7D3] hover:border-[#4C89D9]/50 hover:bg-[#25354B]/50 hover:text-[#F2F5FA] transition-all duration-300"
                    onClick={() => handleEdit(servicio.id)}
                  >
                    <Pencil className="mr-2 h-3.5 w-3.5" /> Editar
                  </Button>
                  <Button
                    type="button"
                  className={`text-xs transition-all duration-300 ${
                    servicio.activo 
                      ? 'bg-gradient-to-r from-[#FF4D4F] to-[#FF8B6B] text-white hover:shadow-lg hover:shadow-[#FF4D4F]/40 hover:scale-105' 
                        : 'bg-gradient-to-r from-[#6DF2A4] to-[#60C2D8] text-white hover:shadow-lg hover:shadow-[#6DF2A4]/40 hover:scale-105'
                    }`}
                    onClick={() => handleToggleActivo(servicio.id, !servicio.activo)}
                    disabled={toggleServicioMutation.isPending}
                  >
                    {toggleServicioMutation.isPending ? (
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    ) : null}
                    {servicio.activo ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <form onSubmit={handleSubmit} className="group relative overflow-hidden space-y-5 rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#F2F5FA]">
            {editingId ? 'Editar servicio' : 'Nuevo servicio'}
          </h2>
          {editingId ? (
            <Button type="button" variant="outline" className="border-2 border-[#25354B] bg-transparent text-xs text-[#BFC7D3] hover:border-[#4C89D9]/50 hover:bg-[#25354B]/50 hover:text-[#F2F5FA] transition-all duration-300" onClick={handleCancelEdit}>
              Cancelar edición
            </Button>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="flex items-center gap-1.5">
              Nombre <span className="text-[#FF8B6B]">*</span>
            </Label>
            <Input
              id="nombre"
              required
              placeholder="Lavado regular"
              value={formState.nombre}
              onChange={(event) => {
                const value = event.target.value;
                setFormState((prev) => ({ ...prev, nombre: value }));
                if (touchedFields.nombre) {
                  const error = getFieldError('nombre', value);
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    if (error) {
                      next.nombre = error;
                    } else {
                      delete next.nombre;
                    }
                    return next;
                  });
                }
              }}
              onBlur={() => handleFieldBlur('nombre')}
              className={fieldErrors.nombre && touchedFields.nombre ? 'border-[#FF8B6B]/50 focus:border-[#FF8B6B] focus:ring-[#FF8B6B]/20' : ''}
            />
            {fieldErrors.nombre && touchedFields.nombre && (
              <div className="flex items-center gap-1.5 text-xs text-[#FF8B6B] animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{fieldErrors.nombre}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="precio" className="flex items-center gap-1.5">
              Precio <span className="text-[#FF8B6B]">*</span>
            </Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="50"
              value={formState.precio}
              onChange={(event) => {
                const value = event.target.value;
                setFormState((prev) => ({ ...prev, precio: value }));
                if (touchedFields.precio) {
                  const error = getFieldError('precio', value);
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    if (error) {
                      next.precio = error;
                    } else {
                      delete next.precio;
                    }
                    return next;
                  });
                }
              }}
              onBlur={() => handleFieldBlur('precio')}
              className={fieldErrors.precio && touchedFields.precio ? 'border-[#FF8B6B]/50 focus:border-[#FF8B6B] focus:ring-[#FF8B6B]/20' : ''}
            />
            {fieldErrors.precio && touchedFields.precio && (
              <div className="flex items-center gap-1.5 text-xs text-[#FF8B6B] animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{fieldErrors.precio}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="unidad" className="flex items-center gap-1.5">
              Unidad <span className="text-[#FF8B6B]">*</span>
            </Label>
            <select
              id="unidad"
              value={formState.unidad}
              onChange={(event) => {
                const value = event.target.value as FormState['unidad'];
                setTouchedFields((prev) => ({ ...prev, unidad: true }));
                setFormState((prev) => ({ ...prev, unidad: value }));
                const error = getFieldError('unidad', value);
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  if (error) {
                    next.unidad = error;
                  } else {
                    delete next.unidad;
                  }
                  return next;
                });
              }}
              onBlur={() => handleFieldBlur('unidad')}
              className={`relative h-11 w-full rounded-2xl border-2 px-4 text-sm text-[#F2F5FA] bg-[#1B2A40]/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                fieldErrors.unidad && touchedFields.unidad
                  ? 'border-[#FF8B6B]/50 focus:border-[#FF8B6B] focus:ring-[#FF8B6B]/20'
                  : 'border-[#25354B]/50 focus:border-[#4C89D9] focus:ring-[#4C89D9]/20'
              }`}
            >
              {unidadOptions.map((option) => (
                <option key={option.value || 'none'} value={option.value} className="bg-[#1B2A40] text-[#F2F5FA]">
                  {option.label}
                </option>
              ))}
            </select>
            {fieldErrors.unidad && touchedFields.unidad && (
              <div className="flex items-center gap-1.5 text-xs text-[#FF8B6B] animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{fieldErrors.unidad}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria" className="flex items-center gap-1.5">
              Categoría <span className="text-[#FF8B6B]">*</span>
            </Label>
            <select
              id="categoria"
              value={formState.categoria}
              onChange={(event) => {
                const value = event.target.value as FormState['categoria'];
                setTouchedFields((prev) => ({ ...prev, categoria: true }));
                setFormState((prev) => ({ ...prev, categoria: value }));
                const error = getFieldError('categoria', value);
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  if (error) {
                    next.categoria = error;
                  } else {
                    delete next.categoria;
                  }
                  return next;
                });
              }}
              onBlur={() => handleFieldBlur('categoria')}
              className={`relative h-11 w-full rounded-2xl border-2 px-4 text-sm text-[#F2F5FA] bg-[#1B2A40]/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                fieldErrors.categoria && touchedFields.categoria
                  ? 'border-[#FF8B6B]/50 focus:border-[#FF8B6B] focus:ring-[#FF8B6B]/20'
                  : 'border-[#25354B]/50 focus:border-[#4C89D9] focus:ring-[#4C89D9]/20'
              }`}
            >
              {categoriaOptions.map((option) => (
                <option key={option.value || 'none'} value={option.value} className="bg-[#1B2A40] text-[#F2F5FA]">
                  {option.label}
                </option>
              ))}
            </select>
            {fieldErrors.categoria && touchedFields.categoria && (
              <div className="flex items-center gap-1.5 text-xs text-[#FF8B6B] animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{fieldErrors.categoria}</span>
              </div>
            )}
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <textarea
              id="descripcion"
              placeholder="Instrucciones o características del servicio"
              className="relative min-h-[80px] w-full rounded-2xl border-2 border-[#25354B]/50 bg-[#1B2A40]/60 px-4 py-3 text-sm text-[#F2F5FA] placeholder:text-[#8FA1B7] focus:border-[#4C89D9] focus:outline-none focus:ring-2 focus:ring-[#4C89D9]/20 transition-all duration-300"
              value={formState.descripcion}
              onChange={(event) => setFormState((prev) => ({ ...prev, descripcion: event.target.value }))}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="imagen">Imagen del servicio (opcional)</Label>
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 rounded-2xl object-cover border-2 border-[#25354B]/50"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8B6B] text-white hover:bg-[#FF8B6B]/80 transition-colors"
                    aria-label="Eliminar imagen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : formState.imagenUrl ? (
                <div className="relative inline-block">
                  <img
                    src={formState.imagenUrl}
                    alt="Imagen actual"
                    className="h-32 w-32 rounded-2xl object-cover border-2 border-[#25354B]/50"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8B6B] text-white hover:bg-[#FF8B6B]/80 transition-colors"
                    aria-label="Eliminar imagen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
              <div className="relative">
                <input
                  type="file"
                  id="imagen"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <Label
                  htmlFor="imagen"
                  className="flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-dashed border-[#25354B]/50 bg-[#1B2A40]/60 px-4 py-3 text-sm text-[#BFC7D3] transition-all duration-300 hover:border-[#4C89D9]/50 hover:bg-[#25354B]/40"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Subiendo imagen...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>{selectedFile ? 'Cambiar imagen' : 'Seleccionar imagen'}</span>
                    </>
                  )}
                </Label>
              </div>
              <p className="text-xs text-[#8FA1B7]">Formatos: JPG, PNG, GIF. Máximo 5MB</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="orden">Orden (opcional)</Label>
            <Input
              id="orden"
              type="number"
              placeholder="1"
              value={formState.orden}
              onChange={(event) => setFormState((prev) => ({ ...prev, orden: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Button
              type="button"
              variant="outline"
              className={`relative border-2 bg-transparent text-xs transition-all duration-300 ${
                formState.activo 
                  ? 'border-[#6DF2A4]/50 bg-[#6DF2A4]/10 text-[#6DF2A4] hover:border-[#6DF2A4] hover:bg-[#6DF2A4]/20' 
                  : 'border-[#25354B] text-[#8FA1B7] hover:border-[#25354B]/50 hover:bg-[#25354B]/30'
              }`}
              onClick={() => setFormState((prev) => ({ ...prev, activo: !prev.activo }))}
            >
              {formState.activo ? 'Activo' : 'Inactivo'}
            </Button>
          </div>
        </div>

        {formError ? (
          <div className="relative group overflow-hidden rounded-2xl border-2 border-[#FF8B6B]/40 bg-gradient-to-br from-[#FF8B6B]/10 via-[#FF8B6B]/5 to-[#FF8B6B]/10 px-4 py-3 text-sm text-[#FF8B6B] backdrop-blur-sm transition-all duration-300 hover:border-[#FF8B6B]/60 hover:shadow-xl hover:shadow-[#FF8B6B]/20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FF8B6B]/5 via-transparent to-[#FF8B6B]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <p className="relative font-semibold">{formError}</p>
          </div>
        ) : null}

        {formSuccess ? (
          <div className="relative group overflow-hidden rounded-2xl border-2 border-[#6DF2A4]/40 bg-gradient-to-br from-[#6DF2A4]/10 via-[#6DF2A4]/5 to-[#6DF2A4]/10 px-4 py-3 text-sm text-[#6DF2A4] backdrop-blur-sm transition-all duration-300 hover:border-[#6DF2A4]/60 hover:shadow-xl hover:shadow-[#6DF2A4]/20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#6DF2A4]/5 via-transparent to-[#6DF2A4]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <p className="relative font-semibold">{formSuccess}</p>
          </div>
        ) : null}

        <div className="relative flex items-center gap-3">
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white shadow-lg shadow-[#4C89D9]/30 hover:shadow-xl hover:shadow-[#4C89D9]/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
            disabled={createServicio.isPending || updateServicioMutation.isPending}
          >
            {(createServicio.isPending || updateServicioMutation.isPending) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {editingId ? 'Guardar cambios' : 'Crear servicio'}
          </Button>
          <Button type="button" variant="outline" className="border-2 border-[#25354B] bg-transparent text-[#BFC7D3] hover:border-[#4C89D9]/50 hover:bg-[#25354B]/50 hover:text-[#F2F5FA] transition-all duration-300" onClick={handleCancelEdit}>
            Limpiar
          </Button>
        </div>
      </form>
    </section>
  );
}

type BadgeEstadoProps = {
  activo: boolean;
};

function BadgeEstado({ activo }: BadgeEstadoProps) {
  return activo ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6DF2A4]/20 text-[#6DF2A4] border border-[#6DF2A4]/30 px-3 py-1.5 text-xs font-bold shadow-sm">
      <CheckCircle2 className="h-3.5 w-3.5" /> Activo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8FA1B7]/20 text-[#8FA1B7] border border-[#8FA1B7]/30 px-3 py-1.5 text-xs font-bold shadow-sm">
      <XCircle className="h-3.5 w-3.5" /> Inactivo
    </span>
  );
}
