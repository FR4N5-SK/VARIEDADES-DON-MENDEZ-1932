"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"
import { InventoryManagement } from "@/components/inventory-management"
import { UsersManagement } from "@/components/users-management"
import { SuppliersManagement } from "@/components/suppliers-management"
import { SalesManagement } from "@/components/sales-management"
import { PointOfSale } from "@/components/point-of-sale"
import { Catalog } from "@/components/catalog"
import { MyOrders } from "@/components/my-orders"
import { OrdersInbox } from "@/components/orders-inbox"
import { PaymentsInbox } from "@/components/payments-inbox"
import { DebtsManagement } from "@/components/debts-management"
import { DailyClose } from "@/components/daily-close"
import { PriceCalculator } from "@/components/price-calculator"
import { Settings } from "@/components/settings"

export function Dashboard() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(
    user?.role === "client1" || user?.role === "client2" ? "catalog" : "dashboard",
  )

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview />
      case "inventory":
        return <InventoryManagement />
      case "users":
        return <UsersManagement />
      case "suppliers":
        return <SuppliersManagement />
      case "sales":
        return <SalesManagement />
      case "pos":
        return <PointOfSale />
      case "catalog":
        return <Catalog />
      case "my-orders":
        return <MyOrders />
      case "orders":
        return <OrdersInbox />
      case "payments":
        return <PaymentsInbox />
      case "debts":
        return <DebtsManagement />
      case "daily-close":
        return <DailyClose />
      case "price-calculator":
        return <PriceCalculator />
      case "settings":
        return <Settings />
      default:
        return user?.role === "client1" || user?.role === "client2" ? <Catalog /> : <DashboardOverview />
    }
  }

  return (
    <DashboardLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </DashboardLayout>
  )
}
