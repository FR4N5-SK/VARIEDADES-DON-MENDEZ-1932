"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, AlertTriangle, TrendingUp, ShoppingCart, Users } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function DashboardOverview() {
  const { products, sales, suppliers, users } = useStore()

  // Calculate metrics
  const totalInventoryValue = products.reduce((sum, p) => sum + p.stock * p.cost, 0)
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock).length
  const todaysSales = sales.filter((sale) => {
    const saleDate = new Date(sale.createdAt)
    const today = new Date()
    return saleDate.toDateString() === today.toDateString()
  })
  const todaysRevenue = todaysSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalProducts = products.length

  // Calculate profit margin
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalCost = sales.reduce((sum, sale) => {
    return (
      sum +
      sale.items.reduce((itemSum, item) => {
        const product = products.find((p) => p.id === item.productId)
        return itemSum + (product?.cost || 0) * item.quantity
      }, 0)
    )
  }, 0)
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0

  // Recent sales
  const recentSales = sales.slice(-5).reverse()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Panel Principal</h2>
        <p className="text-muted-foreground">Resumen general del negocio</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas de Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(todaysRevenue)}</div>
            <p className="text-xs text-muted-foreground">{todaysSales.length} transacciones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos en Stock</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Valor: {formatCurrency(totalInventoryValue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Productos requieren reorden</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margen de Ganancia</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Basado en ventas totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>Las últimas 5 transacciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay ventas registradas</p>
              ) : (
                recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <ShoppingCart className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{sale.cashierName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(sale.createdAt).toLocaleString("es-CO")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(sale.total)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{sale.paymentMethod}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>Estadísticas generales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Usuarios Activos</p>
                    <p className="text-xs text-muted-foreground">Personal registrado</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Proveedores</p>
                    <p className="text-xs text-muted-foreground">Distribuidores activos</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <ShoppingCart className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Ventas</p>
                    <p className="text-xs text-muted-foreground">Todas las transacciones</p>
                  </div>
                </div>
                <p className="text-2xl font-bold">{sales.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products needing reorder */}
      {lowStockProducts > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Productos con Stock Bajo</CardTitle>
            <CardDescription>Productos que necesitan reabastecimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {products
                .filter((p) => p.stock <= p.minStock)
                .map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Código: {product.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-amber-600">
                        Stock: {product.stock} / {product.minStock}
                      </p>
                      <p className="text-xs text-muted-foreground">Reordenar pronto</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
