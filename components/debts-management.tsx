"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { DollarSign } from "lucide-react"

export function DebtsManagement() {
  const { orders, updateOrder } = useStore()
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [manualPaymentAmount, setManualPaymentAmount] = useState("")

  // Group orders by client and calculate debts
  const clientDebts = orders
    .filter((order) => order.total > order.amountPaid && order.status !== "cancelled")
    .reduce(
      (acc, order) => {
        const clientId = order.clientId
        if (!acc[clientId]) {
          acc[clientId] = {
            clientName: order.clientName,
            totalDebt: 0,
            orders: [],
          }
        }
        const debt = order.total - order.amountPaid
        acc[clientId].totalDebt += debt
        acc[clientId].orders.push(order)
        return acc
      },
      {} as Record<
        string,
        {
          clientName: string
          totalDebt: number
          orders: typeof orders
        }
      >,
    )

  const handleManualPayment = () => {
    if (!selectedOrder || !manualPaymentAmount) return

    const order = orders.find((o) => o.id === selectedOrder)
    if (!order) return

    const newAmountPaid = order.amountPaid + Number.parseFloat(manualPaymentAmount)
    const paymentStatus = newAmountPaid >= order.total ? "paid" : "partial"

    updateOrder(selectedOrder, {
      amountPaid: newAmountPaid,
      paymentStatus,
    })

    setShowPaymentDialog(false)
    setSelectedOrder(null)
    setManualPaymentAmount("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cuentas por Cobrar</h2>
        <p className="text-muted-foreground">Gestiona las deudas de los clientes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Deuda Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(Object.values(clientDebts).reduce((sum, client) => sum + client.totalDebt, 0))}
            </div>
            <p className="text-xs text-muted-foreground">De todos los clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Clientes con Deuda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(clientDebts).length}</div>
            <p className="text-xs text-muted-foreground">Clientes activos</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {Object.keys(clientDebts).length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No hay cuentas por cobrar</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(clientDebts).map(([clientId, data]) => (
            <Card key={clientId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{data.clientName}</CardTitle>
                  <Badge variant="destructive" className="text-lg">
                    Debe: {formatCurrency(data.totalDebt)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Pedidos pendientes:</h4>
                    {data.orders.map((order) => {
                      const debt = order.total - order.amountPaid
                      return (
                        <Card key={order.id} className="mb-2">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">Pedido #{order.id.substring(0, 8).toUpperCase()}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString("es-CO")}
                                </p>
                                {order.paymentDueDate && (
                                  <p className="text-xs text-muted-foreground">
                                    Fecha límite: {new Date(order.paymentDueDate).toLocaleDateString("es-CO")}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{formatCurrency(debt)}</p>
                                <p className="text-xs text-muted-foreground">
                                  Pagado: {formatCurrency(order.amountPaid)}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setSelectedOrder(order.id)
                                setShowPaymentDialog(true)
                              }}
                            >
                              <DollarSign className="mr-2 h-4 w-4" />
                              Registrar Abono Manual
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Abono Manual</DialogTitle>
            <DialogDescription>Ingresa el monto del pago recibido</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Monto del Abono</Label>
              <Input
                type="number"
                placeholder="0"
                value={manualPaymentAmount}
                onChange={(e) => setManualPaymentAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleManualPayment} disabled={!manualPaymentAmount}>
              Registrar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
