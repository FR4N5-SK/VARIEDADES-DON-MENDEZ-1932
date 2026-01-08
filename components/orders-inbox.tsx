"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Check, X, Eye } from "lucide-react"

export function OrdersInbox() {
  const { orders, updateOrder, updateProduct, products } = useStore()
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const pendingOrders = orders.filter((order) => order.status === "pending")

  const handleConfirmOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    // Check stock availability
    const stockIssues: string[] = []
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product || product.stock < item.quantity) {
        stockIssues.push(`${item.productName} (Stock: ${product?.stock || 0}, Necesario: ${item.quantity})`)
      }
    })

    if (stockIssues.length > 0) {
      alert(`No hay suficiente stock para:\n${stockIssues.join("\n")}`)
      return
    }

    // Update order status
    updateOrder(orderId, {
      status: "confirmed",
      confirmedAt: new Date().toISOString(),
    })

    // Deduct stock
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (product) {
        updateProduct(product.id, { stock: product.stock - item.quantity })
      }
    })
  }

  const handleRejectOrder = (orderId: string) => {
    updateOrder(orderId, {
      status: "cancelled",
    })
  }

  const handleCompleteOrder = (orderId: string) => {
    updateOrder(orderId, {
      status: "completed",
      completedAt: new Date().toISOString(),
    })
  }

  const selectedOrderData = orders.find((o) => o.id === selectedOrder)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pedidos Pendientes</h2>
        <p className="text-muted-foreground">Gestiona los pedidos de los clientes</p>
      </div>

      <div className="grid gap-4">
        {pendingOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No hay pedidos pendientes</p>
            </CardContent>
          </Card>
        ) : (
          pendingOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pedido de {order.clientName}</CardTitle>
                    <CardDescription>{new Date(order.createdAt).toLocaleString("es-CO")}</CardDescription>
                  </div>
                  <Badge variant="outline">{formatCurrency(order.total)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Productos:</p>
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
                  {order.paymentDueDate && (
                    <div className="text-sm">
                      <span className="font-medium">Fecha de pago: </span>
                      {new Date(order.paymentDueDate).toLocaleDateString("es-CO")}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedOrder(order.id)
                        setShowDetailsDialog(true)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalles
                    </Button>
                    <Button size="sm" onClick={() => handleConfirmOrder(order.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      Confirmar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRejectOrder(order.id)}>
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
        <h3 className="text-xl font-semibold">Pedidos Confirmados</h3>
        {orders.filter((o) => o.status === "confirmed").length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No hay pedidos confirmados</p>
            </CardContent>
          </Card>
        ) : (
          orders
            .filter((o) => o.status === "confirmed")
            .map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Pedido de {order.clientName}</CardTitle>
                      <CardDescription>
                        Confirmado el {new Date(order.confirmedAt!).toLocaleString("es-CO")}
                      </CardDescription>
                    </div>
                    <Badge>{formatCurrency(order.total)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button size="sm" onClick={() => handleCompleteOrder(order.id)}>
                    Marcar como Completado
                  </Button>
                </CardContent>
              </Card>
            ))
        )}
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Pedido</DialogTitle>
            <DialogDescription>Pedido de {selectedOrderData?.clientName}</DialogDescription>
          </DialogHeader>
          {selectedOrderData && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Productos:</h4>
                {selectedOrderData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span>
                      {item.quantity}x {item.productName}
                    </span>
                    <span>{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedOrderData.total)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
