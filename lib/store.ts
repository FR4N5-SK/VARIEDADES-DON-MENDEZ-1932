"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Product {
  id: string
  code: string
  name: string
  imageUrl: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  supplierId: string
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  address: string
  createdAt: string
}

export interface Sale {
  id: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
    subtotal: number
  }[]
  total: number
  paymentMethod: "cash" | "card" | "transfer"
  cashierId: string
  cashierName: string
  createdAt: string
}

export interface StoreUser {
  id: string
  name: string
  email: string
  role: "admin" | "cashier" | "manager" | "client1" | "client2"
  phone?: string
  address?: string
  canCreditPurchase?: boolean
  createdAt: string
}

export interface Order {
  id: string
  clientId: string
  clientName: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
    subtotal: number
  }[]
  total: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  paymentStatus: "pending" | "partial" | "paid"
  amountPaid: number
  paymentDueDate?: string
  createdAt: string
  confirmedAt?: string
  completedAt?: string
}

export interface Payment {
  id: string
  orderId: string
  clientId: string
  clientName: string
  amount: number
  transferReference: string
  paymentDate: string
  status: "pending" | "confirmed"
  createdAt: string
  confirmedAt?: string
}

export interface Settings {
  whatsappNumber: string
}

interface StoreState {
  products: Product[]
  suppliers: Supplier[]
  sales: Sale[]
  users: StoreUser[]
  orders: Order[]
  payments: Payment[]
  settings: Settings
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addSupplier: (supplier: Omit<Supplier, "id" | "createdAt">) => void
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void
  addSale: (sale: Omit<Sale, "id" | "createdAt">) => void
  addUser: (user: Omit<StoreUser, "id" | "createdAt">) => void
  updateUser: (id: string, user: Partial<StoreUser>) => void
  deleteUser: (id: string) => void
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void
  updateOrder: (id: string, order: Partial<Order>) => void
  deleteOrder: (id: string) => void
  addPayment: (payment: Omit<Payment, "id" | "createdAt">) => void
  updatePayment: (id: string, payment: Partial<Payment>) => void
  updateSettings: (settings: Partial<Settings>) => void
}

// Initial mock data
const initialSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Distribuidora El Sol",
    contact: "Carlos Mendez",
    phone: "+57 300 123 4567",
    email: "contacto@elsol.com",
    address: "Calle 45 #12-34, Bogotá",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Importadora La Luna",
    contact: "María García",
    phone: "+57 301 987 6543",
    email: "ventas@laluna.com",
    address: "Carrera 10 #23-45, Medellín",
    createdAt: new Date().toISOString(),
  },
]

const initialProducts: Product[] = [
  {
    id: "1",
    code: "PROD-001",
    name: "Arroz Diana Premium",
    imageUrl: "/bowl-of-rice.png",
    category: "Granos",
    price: 3500,
    cost: 2500,
    stock: 150,
    minStock: 50,
    supplierId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    code: "PROD-002",
    name: "Aceite Girasol 1L",
    imageUrl: "/aceite.jpg",
    category: "Aceites",
    price: 8500,
    cost: 6500,
    stock: 80,
    minStock: 30,
    supplierId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    code: "PROD-003",
    name: "Azúcar Manuelita 1kg",
    imageUrl: "/pile-of-sugar.png",
    category: "Endulzantes",
    price: 4000,
    cost: 3000,
    stock: 200,
    minStock: 80,
    supplierId: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    code: "PROD-004",
    name: "Café Juan Valdez 250g",
    imageUrl: "/cozy-corner-cafe.png",
    category: "Bebidas",
    price: 12000,
    cost: 9000,
    stock: 45,
    minStock: 20,
    supplierId: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    code: "PROD-005",
    name: "Pasta Doria 500g",
    imageUrl: "/colorful-pasta-arrangement.png",
    category: "Pastas",
    price: 3000,
    cost: 2200,
    stock: 120,
    minStock: 50,
    supplierId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const initialSales: Sale[] = [
  {
    id: "1",
    items: [
      { productId: "1", productName: "Arroz Diana Premium", quantity: 2, price: 3500, subtotal: 7000 },
      { productId: "3", productName: "Azúcar Manuelita 1kg", quantity: 1, price: 4000, subtotal: 4000 },
    ],
    total: 11000,
    paymentMethod: "cash",
    cashierId: "2",
    cashierName: "Cajero Principal",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    items: [{ productId: "4", productName: "Café Juan Valdez 250g", quantity: 1, price: 12000, subtotal: 12000 }],
    total: 12000,
    paymentMethod: "card",
    cashierId: "2",
    cashierName: "Cajero Principal",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
]

const initialUsers: StoreUser[] = [
  {
    id: "1",
    name: "Administrator",
    email: "admin@donmendez.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Cajero Principal",
    email: "cajero@donmendez.com",
    role: "cashier",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Cliente Ejemplo 1",
    email: "cliente1@example.com",
    role: "client1",
    phone: "+57 300 111 2222",
    address: "Calle 1 #2-3",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Cliente Ejemplo 2",
    email: "cliente2@example.com",
    role: "client2",
    phone: "+57 300 333 4444",
    address: "Carrera 4 #5-6",
    canCreditPurchase: true,
    createdAt: new Date().toISOString(),
  },
]

const initialSettings: Settings = {
  whatsappNumber: "+573001234567",
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      products: initialProducts,
      suppliers: initialSuppliers,
      sales: initialSales,
      users: initialUsers,
      orders: [],
      payments: [],
      settings: initialSettings,
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: Math.random().toString(36).substring(7),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...product, updatedAt: new Date().toISOString() } : p,
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      addSupplier: (supplier) =>
        set((state) => ({
          suppliers: [
            ...state.suppliers,
            {
              ...supplier,
              id: Math.random().toString(36).substring(7),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateSupplier: (id, supplier) =>
        set((state) => ({
          suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...supplier } : s)),
        })),
      deleteSupplier: (id) =>
        set((state) => ({
          suppliers: state.suppliers.filter((s) => s.id !== id),
        })),
      addSale: (sale) =>
        set((state) => ({
          sales: [
            ...state.sales,
            {
              ...sale,
              id: Math.random().toString(36).substring(7),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      addUser: (user) =>
        set((state) => ({
          users: [
            ...state.users,
            {
              ...user,
              id: Math.random().toString(36).substring(7),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateUser: (id, user) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),
      addOrder: (order) =>
        set((state) => ({
          orders: [
            ...state.orders,
            {
              ...order,
              id: Math.random().toString(36).substring(7),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateOrder: (id, order) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, ...order } : o)),
        })),
      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        })),
      addPayment: (payment) =>
        set((state) => ({
          payments: [
            ...state.payments,
            {
              ...payment,
              id: Math.random().toString(36).substring(7),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updatePayment: (id, payment) =>
        set((state) => ({
          payments: state.payments.map((p) => (p.id === id ? { ...p, ...payment } : p)),
        })),
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
    }),
    {
      name: "store-storage",
    },
  ),
)
