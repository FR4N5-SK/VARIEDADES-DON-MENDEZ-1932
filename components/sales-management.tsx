"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import type { Sale } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Receipt, Calendar, TrendingUp, DollarSign, CreditCard, Banknote, ArrowLeftRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function SalesManagement() {
  const { sales, products } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState("all")

  const openDetailDialog = (sale: Sale) => {
    setSelectedSale(sale)
    setIsDetailDialogOpen(true)
  }

  // Filter by date
  const getFilteredSalesByDate = () => {
    const now = new Date()
    return sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt)
      switch (dateFilter) {
        case "today":
          return saleDate.toDateString() === now.toDateString()
        case "week": {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return saleDate >= weekAgo
        }
        case "month": {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return saleDate >= monthAgo
        }
        default:
          return true
      }
    })
  }

  const filteredSales = getFilteredSalesByDate().filter(
    (sale) =>
      sale.cashierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate metrics
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalTransactions = filteredSales.length
  const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

  const cashSales = filteredSales.filter((s) => s.paymentMethod === "cash").reduce((sum, sale) => sum + sale.total, 0)
  const cardSales = filteredSales.filter((s) => s.paymentMethod === "card").reduce((sum, sale) => sum + sale.total, 0)
  const transferSales = filteredSales
    .filter((s) => s.paymentMethod === "transfer")
    .reduce((sum, sale) => sum + sale.total, 0)

  // Calculate profit
  const totalProfit = filteredSales.reduce((sum, sale) => {
    return (
      sum +
      sale.items.reduce((itemSum, item) => {
        const product = products.find((p) => p.id === item.productId)
        const itemCost = (product?.cost || 0) * item.quantity
        return itemSum + (item.subtotal - itemCost)
      }, 0)
    )
  }, 0)

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4" />
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "transfer":
        return <ArrowLeftRight className="h-4 w-4" />
      default:
        return null
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cash":
        return "Efectivo"
      case "card":
        return "Tarjeta"
      case "transfer":
        return "Transferencia"
      default:
        return method
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Ventas</h2>
        <p className="text-muted-foreground">Historial y análisis de ventas</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Ganancia: {formatCurrency(totalProfit)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Total de ventas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageTicket)}</div>
            <p className="text-xs text-muted-foreground">Por transacción</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Métodos de Pago</CardTitle>
            <CreditCard className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-xs">Efectivo: {formatCurrency(cashSales)}</p>
              <p className="text-xs">Tarjeta: {formatCurrency(cardSales)}</p>
              <p className="text-xs">Transferencia: {formatCurrency(transferSales)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Historial de Ventas</CardTitle>
              <CardDescription>{filteredSales.length} transacciones</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex gap-2">
                <Button
                  variant={dateFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("all")}
                  className={dateFilter === "all" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  Todas
                </Button>
                <Button
                  variant={dateFilter === "today" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("today")}
                  className={dateFilter === "today" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  Hoy
                </Button>
                <Button
                  variant={dateFilter === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("week")}
                  className={dateFilter === "week" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  7 días
                </Button>
                <Button
                  variant={dateFilter === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateFilter("month")}
                  className={dateFilter === "month" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  30 días
                </Button>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar ventas..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Venta</TableHead>
                  <TableHead>Cajero</TableHead>
                  <TableHead>Artículos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron ventas
                    </TableCell>
                  </TableRow>
                ) : (
                  [...filteredSales].reverse().map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono text-sm">{sale.id.substring(0, 8)}</TableCell>
                      <TableCell>{sale.cashierName}</TableCell>
                      <TableCell>{sale.items.length} productos</TableCell>
                      <TableCell className="font-bold">{formatCurrency(sale.total)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {getPaymentMethodIcon(sale.paymentMethod)}
                          {getPaymentMethodLabel(sale.paymentMethod)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(sale.createdAt).toLocaleString("es-CO")}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openDetailDialog(sale)}>
                          Ver Detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Sale Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Venta</DialogTitle>
            <DialogDescription>Información completa de la transacción</DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID de Venta</p>
                  <p className="text-sm font-mono">{selectedSale.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cajero</p>
                  <p className="text-sm">{selectedSale.cashierName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha y Hora</p>
                  <p className="text-sm">{new Date(selectedSale.createdAt).toLocaleString("es-CO")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Método de Pago</p>
                  <p className="text-sm capitalize">{getPaymentMethodLabel(selectedSale.paymentMethod)}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Productos</h4>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead className="text-right">Precio Unit.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSale.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end border-t pt-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total de la Venta</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedSale.total)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
