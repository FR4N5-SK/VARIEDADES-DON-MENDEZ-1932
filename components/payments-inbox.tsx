"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Check, X } from "lucide-react"

export function PaymentsInbox() {
  const { payments, updatePayment, orders, updateOrder } = useStore()

  const pendingPayments = payments.filter((p) => p.status === "pending")

  const handleConfirmPayment = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId)
    if (!payment) return

    const order = orders.find((o) => o.id === payment.orderId)
    if (!order) return

    // Update payment status
    updatePayment(paymentId, {
      status: "confirmed",
      confirmedAt: new Date().toISOString(),
    })

    // Update order amount paid
    const newAmountPaid = order.amountPaid + payment.amount
    const paymentStatus = newAmountPaid >= order.total ? "paid" : "partial"

    updateOrder(payment.orderId, {
      amountPaid: newAmountPaid,
      paymentStatus,
    })
  }

  const handleRejectPayment = (paymentId: string) => {
    updatePayment(paymentId, {
      status: "confirmed",
      confirmedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pagos Pendientes</h2>
        <p className="text-muted-foreground">Confirma los pagos de los clientes</p>
      </div>

      <div className="grid gap-4">
        {pendingPayments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No hay pagos pendientes</p>
            </CardContent>
          </Card>
        ) : (
          pendingPayments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{payment.clientName}</CardTitle>
                    <CardDescription>
                      Abono realizado el {new Date(payment.createdAt).toLocaleString("es-CO")}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg">
                    {formatCurrency(payment.amount)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Referencia: </span>
                    {payment.transferReference}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Fecha de pago: </span>
                    {new Date(payment.paymentDate).toLocaleDateString("es-CO")}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" onClick={() => handleConfirmPayment(payment.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      Confirmar Pago
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRejectPayment(payment.id)}>
                      <X className="mr-2 h-4 w-4" />
                      Rechazar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Pagos Confirmados Hoy</h3>
        {payments.filter(
          (p) => p.status === "confirmed" && new Date(p.confirmedAt!).toDateString() === new Date().toDateString(),
        ).length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No hay pagos confirmados hoy</p>
            </CardContent>
          </Card>
        ) : (
          payments
            .filter(
              (p) => p.status === "confirmed" && new Date(p.confirmedAt!).toDateString() === new Date().toDateString(),
            )
            .map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{payment.clientName}</p>
                      <p className="text-sm text-muted-foreground">Ref: {payment.transferReference}</p>
                    </div>
                    <p className="font-bold text-emerald-600">{formatCurrency(payment.amount)}</p>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  )
}
