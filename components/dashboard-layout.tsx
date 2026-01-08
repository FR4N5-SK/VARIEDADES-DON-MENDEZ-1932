"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Package,
  Users,
  TruckIcon,
  ShoppingCart,
  Store,
  LogOut,
  Menu,
  X,
  User,
  Inbox,
  CreditCard,
  DollarSign,
  FileText,
  Calculator,
  SettingsIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage: string
  onNavigate: (page: string) => void
}

export function DashboardLayout({ children, currentPage, onNavigate }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navigation = [
    { name: "Panel Principal", icon: LayoutDashboard, page: "dashboard", roles: ["admin", "manager", "cashier"] },
    { name: "Inventario", icon: Package, page: "inventory", roles: ["admin", "manager"] },
    { name: "Usuarios", icon: Users, page: "users", roles: ["admin"] },
    { name: "Proveedores", icon: TruckIcon, page: "suppliers", roles: ["admin", "manager"] },
    { name: "Ventas", icon: ShoppingCart, page: "sales", roles: ["admin", "manager"] },
    { name: "Punto de Venta", icon: Store, page: "pos", roles: ["admin", "cashier", "manager"] },
    {
      name: "Pedidos Pendientes",
      icon: Inbox,
      page: "orders",
      roles: ["admin", "manager", "cashier"],
    },
    {
      name: "Pagos Pendientes",
      icon: CreditCard,
      page: "payments",
      roles: ["admin", "manager", "cashier"],
    },
    {
      name: "Cuentas por Cobrar",
      icon: DollarSign,
      page: "debts",
      roles: ["admin", "manager", "cashier"],
    },
    {
      name: "Cierre Diario",
      icon: FileText,
      page: "daily-close",
      roles: ["admin", "manager", "cashier"],
    },
    {
      name: "Calcular Precios",
      icon: Calculator,
      page: "price-calculator",
      roles: ["admin", "manager"],
    },
    {
      name: "Configuración",
      icon: SettingsIcon,
      page: "settings",
      roles: ["admin"],
    },
    {
      name: "Catálogo",
      icon: Store,
      page: "catalog",
      roles: ["client1", "client2"],
    },
    {
      name: "Mis Pedidos",
      icon: ShoppingCart,
      page: "my-orders",
      roles: ["client1", "client2"],
    },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user?.role || ""))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">Variedades Don Mendez</h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestión 1932</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">Rol: {user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:translate-x-0 top-16",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <nav className="flex flex-col gap-1 p-4">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.page}
                  variant={currentPage === item.page ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start",
                    currentPage === item.page && "bg-emerald-100 text-emerald-900 hover:bg-emerald-200",
                  )}
                  onClick={() => {
                    onNavigate(item.page)
                    setIsSidebarOpen(false)
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
