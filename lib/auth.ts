"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "./supabase"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "cashier" | "manager" | "client1" | "client2"
  phone?: string
  address?: string
  canCreditPurchase?: boolean
  createdAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    address?: string,
  ) => Promise<{ success: boolean; error?: string }>
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .eq("password", password)
            .single()

          if (error || !data) {
            console.log("[v0] Login error:", error?.message)
            return false
          }

          const user: User = {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
            phone: data.phone || undefined,
            address: data.address || undefined,
            canCreditPurchase: data.can_credit_purchase,
            createdAt: data.created_at,
          }

          set({ user, isAuthenticated: true })
          return true
        } catch (error) {
          console.error("[v0] Login error:", error)
          return false
        }
      },
      register: async (name: string, email: string, password: string, phone?: string, address?: string) => {
        try {
          console.log("[v0] Iniciando registro para:", email)

          // Verificar si el correo ya existe
          const { data: existing, error: checkError } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single()

          if (existing) {
            console.log("[v0] Correo ya existe:", email)
            return { success: false, error: "El correo electrónico ya está registrado" }
          }

          // Insertar nuevo usuario
          const { data, error } = await supabase
            .from("users")
            .insert([
              {
                name: name || "Usuario",
                email: email,
                password: password,
                role: "client1",
                phone: phone || null,
                address: address || null,
                can_credit_purchase: false,
              },
            ])
            .select()
            .single()

          if (error) {
            console.log("[v0] Error al insertar usuario:", error.message)
            return { success: false, error: error.message || "Error al crear el usuario" }
          }

          if (!data) {
            console.log("[v0] No se recibieron datos después de insertar")
            return { success: false, error: "Error al crear el usuario" }
          }

          console.log("[v0] Usuario registrado exitosamente:", data.id)
          return { success: true }
        } catch (error) {
          console.error("[v0] Register error:", error)
          return { success: false, error: "Error en el registro" }
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
