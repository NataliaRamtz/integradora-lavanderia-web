"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Mail, ArrowLeft } from "lucide-react"

export default function NuevoPedidoPage() {
  const router = useRouter()

  const [orderData, setOrderData] = useState({
    cliente: "",
    fechaPedido: "",
    fechaEntrega: "",
    estado: "pendiente",
    metodoPago: "efectivo",
    montoPagado: "",
  })

  const [servicios, setServicios] = useState([
    { id: 1, nombre: "Lavado y Doblado", cantidad: "2 kg", precio: 15.0, total: 30.0 },
    { id: 2, nombre: "Lavado en Seco", cantidad: "1 pieza", precio: 10.0, total: 10.0 },
    { id: 3, nombre: "Planchado", cantidad: "3 piezas", precio: 7.5, total: 22.5 },
  ])

  const subtotal = servicios.reduce((sum, s) => sum + s.total, 0)
  const iva = subtotal * 0.05
  const total = subtotal + iva

  const handleCrearPedido = () => {
    console.log("[v0] Creating order:", { orderData, servicios, total })
    // Here you would typically send data to an API
    router.push("/pedidos")
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/pedidos")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Registrar Nuevo Pedido</h1>
              <p className="text-muted-foreground">Completa la información del pedido</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/pedidos")}>
              Cancelar
            </Button>
            <Button onClick={handleCrearPedido}>Crear Pedido</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Detalles del Pedido */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Detalles del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cliente</label>
                  <Input
                    placeholder="Buscar cliente o agregar nuevo"
                    value={orderData.cliente}
                    onChange={(e) => setOrderData({ ...orderData, cliente: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ID de Pedido</label>
                  <Input placeholder="Generado automáticamente" disabled />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha del Pedido</label>
                  <Input
                    type="date"
                    value={orderData.fechaPedido}
                    onChange={(e) => setOrderData({ ...orderData, fechaPedido: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha de Entrega</label>
                  <Input
                    type="date"
                    value={orderData.fechaEntrega}
                    onChange={(e) => setOrderData({ ...orderData, fechaEntrega: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select
                  value={orderData.estado}
                  onValueChange={(value) => setOrderData({ ...orderData, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en-proceso">En Proceso</SelectItem>
                    <SelectItem value="listo">Listo</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pago */}
          <Card>
            <CardHeader>
              <CardTitle>Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Método de Pago</label>
                <Select
                  value={orderData.metodoPago}
                  onValueChange={(value) => setOrderData({ ...orderData, metodoPago: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Monto Pagado</label>
                <Input
                  type="number"
                  placeholder="$ 0.00"
                  value={orderData.montoPagado}
                  onChange={(e) => setOrderData({ ...orderData, montoPagado: e.target.value })}
                />
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA (5%)</span>
                  <span className="font-medium">${iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Servicios */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Servicios</CardTitle>
              <Button variant="link" className="gap-2 text-primary">
                <Plus className="h-4 w-4" />
                Añadir Servicio
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SERVICIO</TableHead>
                  <TableHead>CANTIDAD</TableHead>
                  <TableHead>PRECIO</TableHead>
                  <TableHead className="text-right">TOTAL</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicios.map((servicio) => (
                  <TableRow key={servicio.id}>
                    <TableCell className="font-medium">{servicio.nombre}</TableCell>
                    <TableCell>{servicio.cantidad}</TableCell>
                    <TableCell>${servicio.precio.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">${servicio.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="link" className="text-primary">
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Ticket */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Ticket</label>
              <Select defaultValue="qr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qr">Código QR Digital</SelectItem>
                  <SelectItem value="codigo">Código Numérico</SelectItem>
                  <SelectItem value="impreso">Ticket Impreso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Código del Ticket</label>
              <Input placeholder="Generado automáticamente" disabled />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Enviar ticket al cliente vía:</label>
              <div className="flex gap-2">
                <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </Button>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <Mail className="h-4 w-4" />
                  Correo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
