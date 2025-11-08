"use client"

import { useMemo, useState } from "react"

import LaundryLayout from "@/components/layouts/laundry-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Save, Sparkles } from "lucide-react"

type CatalogItem = {
  id: string
  name: string
  category: "Servicio" | "Adicional" | "Promoción"
  description: string
  basePrice: number
  price: number
  active: boolean
  notes?: string
}

const INITIAL_CATALOG: CatalogItem[] = [
  {
    id: "lavado-express",
    name: "Lavado Express",
    category: "Servicio",
    description: "Entrega en menos de 4 horas. Incluye detergente hipoalergénico.",
    basePrice: 75,
    price: 85,
    active: true,
    notes: "Aplicar recargo nocturno +15% después de las 18:00.",
  },
  {
    id: "lavado-planchado",
    name: "Lavado + Planchado",
    category: "Servicio",
    description: "Lavado tradicional y planchado a vapor para ropa casual.",
    basePrice: 55,
    price: 68,
    active: true,
  },
  {
    id: "planchado-rapido",
    name: "Planchado rápido",
    category: "Adicional",
    description: "Servicio adicional por prenda; ideal para urgencias.",
    basePrice: 25,
    price: 32,
    active: false,
    notes: "Activar sólo cuando haya capacidad extra del personal.",
  },
  {
    id: "desmanchado-premium",
    name: "Desmanchado Premium",
    category: "Adicional",
    description: "Tratamiento especial para manchas difíciles y prendas delicadas.",
    basePrice: 90,
    price: 110,
    active: true,
  },
  {
    id: "promo-fidelidad",
    name: "Promoción Lealtad",
    category: "Promoción",
    description: "10% de descuento en pedidos mayores a $400 pesos.",
    basePrice: 0,
    price: 0,
    active: true,
    notes: "Aplicar sólo a clientes registrados en CRM.",
  },
]

export default function LaundryCatalogPage() {
  const [catalog, setCatalog] = useState<CatalogItem[]>(INITIAL_CATALOG)
  const [notes, setNotes] = useState("")

  const summary = useMemo(() => {
    const totalItems = catalog.length
    const activeItems = catalog.filter((item) => item.active).length
    const inactiveItems = totalItems - activeItems
    const averagePrice =
      catalog
        .filter((item) => item.price > 0)
        .reduce((acc, item) => acc + item.price, 0) /
      Math.max(1, catalog.filter((item) => item.price > 0).length)

    return {
      totalItems,
      activeItems,
      inactiveItems,
      averagePrice,
    }
  }, [catalog])

  const handleToggle = (id: string, value: boolean) => {
    setCatalog((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              active: value,
            }
          : item,
      ),
    )
  }

  const handlePriceChange = (id: string, nextPrice: string) => {
    const parsed = Number(nextPrice)
    setCatalog((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              price: Number.isNaN(parsed) ? item.price : parsed,
            }
          : item,
      ),
    )
  }

  const handleSave = () => {
    console.log("[catalog] update", catalog, { notes })
    window.alert("Cambios guardados en el catálogo.")
  }

  return (
    <LaundryLayout headerTitle="Gestión de Catálogos" headerSubtitle="Administra servicios, precios y disponibilidad.">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Resumen general</CardTitle>
            <CardDescription>Estado actual de los servicios y promociones disponibles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-xs uppercase text-muted-foreground">Total en catálogo</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{summary.totalItems}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-xs uppercase text-muted-foreground">Activos</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{summary.activeItems}</p>
              </div>
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4">
                <p className="text-xs uppercase text-muted-foreground">Inactivos</p>
                <p className="mt-2 text-xl font-semibold text-foreground">{summary.inactiveItems}</p>
              </div>
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4">
                <p className="text-xs uppercase text-muted-foreground">Precio promedio</p>
                <p className="mt-2 text-xl font-semibold text-foreground">${summary.averagePrice.toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="catalog-notes">Notas internas</Label>
              <Textarea
                id="catalog-notes"
                placeholder="Ej. Actualizar tarifas cada 15 días, contactar proveedor de detergentes premium, etc."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Estas notas no se muestran al cliente. Úsalas para recordar acciones pendientes relacionadas con los catálogos.
              </p>
            </div>

            <Separator />

            <Button onClick={handleSave} className="w-full gap-2">
              <Save className="h-4 w-4" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 lg:order-first">
          <CardHeader>
            <CardTitle>Servicios y precios</CardTitle>
            <CardDescription>Activa o ajusta rápidamente los servicios ofrecidos en la sucursal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Tips para un catálogo saludable
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Revisa los precios activamente según demandas y costos de insumos.</li>
                <li>Desactiva servicios con baja disponibilidad para evitar sobrecarga.</li>
                <li>Usa la sección de notas para coordinar cambios con el administrador.</li>
              </ul>
            </div>

            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead className="hidden md:table-cell">Categoría</TableHead>
                    <TableHead className="hidden md:table-cell">Precio base</TableHead>
                    <TableHead>Precio actual</TableHead>
                    <TableHead className="text-right">Activo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalog.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="space-y-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                        {item.notes && (
                          <p className="text-xs text-primary/80">
                            • {item.notes}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        ${item.basePrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Label htmlFor={`price-${item.id}`} className="sr-only">
                            Precio {item.name}
                          </Label>
                          <Input
                            id={`price-${item.id}`}
                            type="number"
                            min={0}
                            step="0.5"
                            value={item.price}
                            onChange={(event) => handlePriceChange(item.id, event.target.value)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Switch
                          checked={item.active}
                          onCheckedChange={(value) => handleToggle(item.id, Boolean(value))}
                          aria-label={`Cambiar estado de ${item.name}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </LaundryLayout>
  )
}

