"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Calendar, CreditCard } from "lucide-react"

export function MyOrders() {
  const { orders, addPayment, payments } = useStore()
  const { user } = useAuth()
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentReference, setPaymentReference] = useState("")
  const [paymentDate, setPaymentDate] = useState("")

  const myOrders = orders.filter((order) => order.clientId === user?.id)
  const myPayments = payments.filter((payment) => payment.clientId === user?.id)

  const handlePayment = () => {
    if (!selectedOrder || !paymentAmount || !paymentReference || !paymentDate) return

    const order = orders.find((o) => o.id === selectedOrder)!

    addPayment({
      orderId: selectedOrder,
      clientId: user!.id,
      clientName: user!.name,
      amount: Number.parseFloat(paymentAmount),
      transferReference: paymentReference,
      paymentDate,
      status: "pending",
    })

    setShowPaymentDialog(false)
    setSelectedOrder(null)
    setPaymentAmount("")
    setPaymentReference("")
    setPaymentDate("")
  }

  const getOrderDebt = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return 0
    return order.total - order.amountPaid
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mis Pedidos</h2>
        <p className="text-muted-foreground">Gestiona tus pedidos y realiza pagos</p>
      </div>

      <div className="grid gap-6">
        {myOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No tienes pedidos aún</p>
            </CardContent>
          </Card>
        ) : (
          myOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pedido #{order.id.substring(0, 8).toUpperCase()}</CardTitle>
                  <div className="flex gap-2">
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "confirmed"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {order.status === "pending"
                        ? "Pendiente"
                        : order.status === "confirmed"
                          ? "Confirmado"
                          : order.status === "completed"
                            ? "Completado"
                            : "Cancelado"}
                    </Badge>
                    <Badge
                      variant={
                        order.paymentStatus === "paid"
                          ? "default"
                          : order.paymentStatus === "partial"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {order.paymentStatus === "paid"
                        ? "Pagado"
                        : order.paymentStatus === "partial"
                          ? "Pago Parcial"
                          : "Pendiente de Pago"}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  <div className="flex items-center gap-4 text-xs">
                    <span>{new Date(order.createdAt).toLocaleString("es-CO")}</span>
                    {order.paymentDueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Fecha de pago: {new Date(order.paymentDueDate).toLocaleDateString("es-CO")}
                      </span>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Productos:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {item.quantity}x {item.productName}
                          </span>
                          <span>{formatCurrency(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Pagado:</span>
                      <span>{formatCurrency(order.amountPaid)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-emerald-600">
                      <span>Saldo:</span>
                      <span>{formatCurrency(getOrderDebt(order.id))}</span>
                    </div>
                  </div>
                  {getOrderDebt(order.id) > 0 && order.status !== "cancelled" && (
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedOrder(order.id)
                        setShowPaymentDialog(true)
                      }}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Realizar Abono
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Mis Pagos</h3>
        {myPayments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No has realizado pagos aún</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {myPayments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                      <p className="text-sm text-muted-foreground">Ref: {payment.transferReference}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.paymentDate).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                    <Badge variant={payment.status === "confirmed" ? "default" : "secondary"}>
                      {payment.status === "confirmed" ? "Confirmado" : "Pendiente"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Realizar Abono</DialogTitle>
            <DialogDescription>Ingresa los datos de tu transferencia</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Monto</Label>
              <Input
                type="number"
                placeholder="0"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div>
              <Label>Referencia de Transferencia</Label>
              <Input
                placeholder="Ej: TRANS-123456"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
              />
            </div>
            <div>
              <Label>Fecha de Pago</Label>
              <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePayment} disabled={!paymentAmount || !paymentReference || !paymentDate}>
              Enviar Abono
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
