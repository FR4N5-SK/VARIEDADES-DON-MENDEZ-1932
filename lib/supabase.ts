import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  users: {
    id: string
    name: string
    email: string
    password: string
    role: "admin" | "cashier" | "manager" | "client1" | "client2"
    phone: string | null
    address: string | null
    can_credit_purchase: boolean
    created_at: string
  }
  suppliers: {
    id: string
    name: string
    contact: string
    phone: string
    email: string
    address: string
    created_at: string
  }
  products: {
    id: string
    code: string
    name: string
    image_url: string | null
    category: string
    price: number
    cost: number
    stock: number
    min_stock: number
    supplier_id: string | null
    created_at: string
    updated_at: string
  }
  sales: {
    id: string
    items: any[]
    total: number
    payment_method: string
    cashier_id: string
    cashier_name: string
    created_at: string
  }
  orders: {
    id: string
    client_id: string
    client_name: string
    items: any[]
    total: number
    status: string
    payment_status: string
    amount_paid: number
    payment_due_date: string | null
    created_at: string
    confirmed_at: string | null
    completed_at: string | null
  }
  payments: {
    id: string
    order_id: string
    client_id: string
    client_name: string
    amount: number
    transfer_reference: string
    payment_date: string
    status: string
    created_at: string
    confirmed_at: string | null
  }
  settings: {
    id: string
    whatsapp_number: string
    updated_at: string
  }
}
