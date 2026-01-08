"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"

export function DailyClose() {
  const { sales, payments } = useStore()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const getSalesForDate = (date: string) => {
    return sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt).toISOString().split("T")[0]
      return saleDate === date
    })
  }

  const getPaymentsForDate = (date: string) => {
    return payments.filter((payment) => {
      const paymentDate = new Date(payment.confirmedAt || payment.createdAt).toISOString().split("T")[0]
      return paymentDate === date && payment.status === "confirmed"
    })
  }

  const daySales = getSalesForDate(selectedDate)
  const dayPayments = getPaymentsForDate(selectedDate)

  const totalSales = daySales.reduce((sum, sale) => sum + sale.total, 0)
  const totalPayments = dayPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalIncome = totalSales + totalPayments

  const salesByCashMethod = daySales.filter((s) => s.paymentMethod === "cash").reduce((sum, s) => sum + s.total, 0)
  const salesByCardMethod = daySales.filter((s) => s.paymentMethod === "card").reduce((sum, s) => sum + s.total, 0)
  const salesByTransferMethod = daySales
    .filter((s) => s.paymentMethod === "transfer")
    .reduce((sum, s) => sum + s.total, 0)

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new()

    // Sales sheet
    const salesData = daySales.map((sale) => ({
      "ID Venta": sale.id.substring(0, 8).toUpperCase(),
      Fecha: new Date(sale.createdAt).toLocaleString("es-CO"),
      Cajero: sale.cashierName,
      "Método de Pago":
        sale.paymentMethod === "cash" ? "Efectivo" : sale.paymentMethod === "card" ? "Tarjeta" : "Transferencia",
      Total: sale.total,
      Productos: sale.items.map((item) => `${item.quantity}x ${item.productName}`).join(", "),
    }))
    const salesSheet = XLSX.utils.json_to_sheet(salesData)
    XLSX.utils.book_append_sheet(wb, salesSheet, "Ventas")

    // Payments sheet
    const paymentsData = dayPayments.map((payment) => ({
      "ID Pago": payment.id.substring(0, 8).toUpperCase(),
      Cliente: payment.clientName,
      Monto: payment.amount,
      Referencia: payment.transferReference,
      "Fecha de Pago": new Date(payment.paymentDate).toLocaleDateString("es-CO"),
      "Confirmado el": new Date(payment.confirmedAt!).toLocaleString("es-CO"),
    }))
    const paymentsSheet = XLSX.utils.json_to_sheet(paymentsData)
    XLSX.utils.book_append_sheet(wb, paymentsSheet, "Abonos")

    // Summary sheet
    const summaryData = [
      { Concepto: "Total Ventas", Valor: totalSales },
      { Concepto: "Total Abonos", Valor: totalPayments },
      { Concepto: "Total Ingresos", Valor: totalIncome },
      { Concepto: "", Valor: "" },
      { Concepto: "Ventas en Efectivo", Valor: salesByCashMethod },
      { Concepto: "Ventas con Tarjeta", Valor: salesByCardMethod },
      { Concepto: "Ventas por Transferencia", Valor: salesByTransferMethod },
    ]
    const summarySheet = XLSX.utils.json_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summarySheet, "Resumen")

    const fileName = `cierre-diario-${selectedDate}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cierre Diario</h2>
        <p className="text-muted-foreground">Genera reportes de ventas y pagos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Fecha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Fecha</Label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            <Button onClick={handleExportToExcel} className="mt-6">
              <Download className="mr-2 h-4 w-4" />
              Exportar a Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">{daySales.length} ventas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Abonos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalPayments)}</div>
            <p className="text-xs text-muted-foreground">{dayPayments.length} pagos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">Ventas + Abonos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Efectivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(salesByCashMethod)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tarjeta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(salesByCardMethod)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Transferencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(salesByTransferMethod)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          {daySales.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay ventas para esta fecha</p>
          ) : (
            <div className="space-y-2">
              {daySales.map((sale) => (
                <Card key={sale.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">#{sale.id.substring(0, 8).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">{sale.cashierName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(sale.createdAt).toLocaleTimeString("es-CO")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{formatCurrency(sale.total)}</p>
                        <Badge variant="outline">
                          {sale.paymentMethod === "cash"
                            ? "Efectivo"
                            : sale.paymentMethod === "card"
                              ? "Tarjeta"
                              : "Transferencia"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de Abonos</CardTitle>
        </CardHeader>
        <CardContent>
          {dayPayments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay abonos para esta fecha</p>
          ) : (
            <div className="space-y-2">
              {dayPayments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{payment.clientName}</p>
                        <p className="text-sm text-muted-foreground">Ref: {payment.transferReference}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.confirmedAt!).toLocaleTimeString("es-CO")}
                        </p>
                      </div>
                      <p className="font-bold text-blue-600">{formatCurrency(payment.amount)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
