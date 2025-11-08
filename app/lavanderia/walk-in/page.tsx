"use client"

import { useMemo, useState } from "react"

import LaundryLayout from "@/components/layouts/laundry-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Plus, Printer, Trash2 } from "lucide-react"

type WalkInItem = {
  id: string
  description: string
  quantity: number
  price: number
}

const SERVICE_OPTIONS = [
  { value: "lavado-express", label: "Lavado Express" },
  { value: "lavado-planchado", label: "Lavado + Planchado" },
  { value: "planchado", label: "Solo Planchado" },
  { value: "servicio-premium", label: "Servicio Premium" },
]

export default function WalkInPage() {
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [serviceType, setServiceType] = useState<string | undefined>(undefined)
  const [notes, setNotes] = useState("")
  const [express, setExpress] = useState(false)
  const [items, setItems] = useState<WalkInItem[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 },
  ])

  const ticketNumber = useMemo(() => {
    const randomSegment = Math.floor(Math.random() * 9000 + 1000)
    return `WK-${randomSegment}`
  }, [])

  const readyAt = useMemo(() => {
    const date = new Date()
    if (express) {
      date.setHours(date.getHours() + 4)
    } else {
      date.setDate(date.getDate() + 1)
    }
    return date.toLocaleString("es-MX", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [express])

  const total = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.price, 0)
  }, [items])

  const pickupPin = useMemo(() => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }, [])

  const qrUrl = useMemo(() => {
    const payload = {
      ticketNumber,
      pin: pickupPin,
      customerName,
      total,
    }
    const dataString = encodeURIComponent(JSON.stringify(payload))
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${dataString}`
  }, [ticketNumber, pickupPin, customerName, total])

  const handleItemChange = (id: string, field: keyof WalkInItem, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "quantity" || field === "price" ? Number(value) : value,
            }
          : item,
      ),
    )
  }

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 },
    ])
  }

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("[walk-in] submit", {
      ticketNumber,
      customer: { customerName, customerPhone, customerEmail },
      serviceType,
      express,
      items,
      notes,
      readyAt,
      total,
      pickupPin,
    })
    window.alert("Pedido walk-in registrado. Ticket generado.")
  }

  return (
    <LaundryLayout headerTitle="Registro Walk-In" headerSubtitle="Agrega pedidos de clientes que llegan directamente a tu lavandería">
      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Datos del Cliente</CardTitle>
              <CardDescription>Identifica a la persona que dejó la ropa en la sucursal.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="customer-name">Nombre completo</Label>
                <Input
                  id="customer-name"
                  placeholder="Ej. Mariana Torres"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-phone">Teléfono</Label>
                <Input
                  id="customer-phone"
                  placeholder="(55) 1234 5678"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-email">Correo electrónico (opcional)</Label>
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="cliente@correo.com"
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Detalles del Servicio</CardTitle>
              <CardDescription>Selecciona el servicio y captura los artículos a procesar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="service-type">Tipo de servicio</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger id="service-type">
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 flex items-center gap-3 pt-2 md:pt-8">
                  <Checkbox
                    id="express"
                    checked={express}
                    onCheckedChange={(value) => setExpress(Boolean(value))}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="express">Entrega express</Label>
                    <p className="text-xs text-muted-foreground">
                      Lista en menos de 4 horas. Aplica cargo adicional.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Artículos</h3>
                  <p className="text-xs text-muted-foreground">
                    Captura cada prenda o servicio individual para generar el ticket.
                  </p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={handleAddItem} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Añadir artículo
                </Button>
              </div>

              <div className="grid gap-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 md:grid-cols-[2fr,repeat(2,1fr),auto]"
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`item-description-${item.id}`}>Descripción</Label>
                      <Input
                        id={`item-description-${item.id}`}
                        placeholder="Ej. 3 camisas, Edredón matrimonial"
                        value={item.description}
                        onChange={(event) => handleItemChange(item.id, "description", event.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`item-quantity-${item.id}`}>Cantidad</Label>
                      <Input
                        id={`item-quantity-${item.id}`}
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) => handleItemChange(item.id, "quantity", event.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`item-price-${item.id}`}>Precio unitario</Label>
                      <Input
                        id={`item-price-${item.id}`}
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.price}
                        onChange={(event) => handleItemChange(item.id, "price", event.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-end justify-end">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label="Eliminar artículo"
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="md:col-span-4">
                      <p className="text-xs text-muted-foreground">
                        Subtotal artículo #{index + 1}:{" "}
                        <span className="font-semibold text-foreground">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas adicionales</Label>
                <Textarea
                  id="notes"
                  placeholder="Instrucciones especiales, manchas a tratar, preferencia de detergentes, etc."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="reset" variant="outline" onClick={() => window.location.reload()}>
                Limpiar formulario
              </Button>
              <Button type="submit" className="gap-2">
                <Printer className="h-4 w-4" />
                Generar ticket
              </Button>
            </CardFooter>
          </Card>
        </form>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Ticket</CardTitle>
              <CardDescription>Imprime o comparte esta información con el cliente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Ticket</p>
                  <p className="text-lg font-semibold">{ticketNumber}</p>
                </div>
                <Badge variant={express ? "destructive" : "secondary"}>
                  {express ? "Express" : "Estándar"}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Cliente</p>
                <p className="text-sm text-muted-foreground">
                  {customerName || "Nombre por confirmar"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {customerPhone || "Teléfono pendiente"}
                </p>
                {customerEmail && <p className="text-sm text-muted-foreground">{customerEmail}</p>}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Servicio</p>
                <p className="text-sm text-muted-foreground">
                  {SERVICE_OPTIONS.find((option) => option.value === serviceType)?.label ?? "Sin seleccionar"}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Ticket Digital</p>
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-4">
                  <img
                    src={qrUrl}
                    alt="Código QR para recoger el pedido"
                    className="h-40 w-40 rounded-md border border-border bg-background p-2"
                  />
                  <div className="w-full text-center">
                    <p className="text-xs uppercase text-muted-foreground">PIN de entrega</p>
                    <p className="font-mono text-2xl font-semibold tracking-widest text-foreground">{pickupPin}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    El cliente puede mostrar el QR o dictar el PIN para recoger su pedido.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Artículos</p>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity} × {item.description || "Descripción pendiente"}
                      </span>
                      <span className="font-medium text-foreground">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarClock className="h-4 w-4" />
                  {readyAt}
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-muted-foreground">Total a cobrar</p>
                  <p className="text-xl font-semibold text-foreground">${total.toFixed(2)}</p>
                </div>
              </div>

              {notes && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-xs uppercase text-muted-foreground">Notas</p>
                    <p className="text-sm text-foreground">{notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Abona el ticket al sistema una vez confirmado el pago.</p>
              <p>• Coloca el ticket impreso sobre la bolsa o contenedor de la ropa.</p>
              <p>• Para clientes recurrentes, verifica si ya existe un registro previo.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </LaundryLayout>
  )
}

