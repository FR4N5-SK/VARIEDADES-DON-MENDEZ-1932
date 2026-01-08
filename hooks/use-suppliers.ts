"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { Supplier } from "@/lib/store"

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    let subscription: any

    const fetchAndSubscribe = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("suppliers")
          .select("*")
          .order("created_at", { ascending: false })

        if (fetchError) throw fetchError

        const mappedSuppliers = (data || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          contact: s.contact,
          phone: s.phone,
          email: s.email,
          address: s.address,
          createdAt: s.created_at,
        }))

        setSuppliers(mappedSuppliers)

        subscription = supabase
          .channel("suppliers")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "suppliers",
            },
            (payload: any) => {
              if (payload.eventType === "INSERT") {
                const newSupplier = {
                  id: payload.new.id,
                  name: payload.new.name,
                  contact: payload.new.contact,
                  phone: payload.new.phone,
                  email: payload.new.email,
                  address: payload.new.address,
                  createdAt: payload.new.created_at,
                }
                setSuppliers((prev) => [newSupplier, ...prev])
              } else if (payload.eventType === "UPDATE") {
                setSuppliers((prev) =>
                  prev.map((s) =>
                    s.id === payload.new.id
                      ? {
                          id: payload.new.id,
                          name: payload.new.name,
                          contact: payload.new.contact,
                          phone: payload.new.phone,
                          email: payload.new.email,
                          address: payload.new.address,
                          createdAt: payload.new.created_at,
                        }
                      : s,
                  ),
                )
              } else if (payload.eventType === "DELETE") {
                setSuppliers((prev) => prev.filter((s) => s.id !== payload.old.id))
              }
            },
          )
          .subscribe()

        setLoading(false)
      } catch (err) {
        console.error("[v0] Error fetching suppliers:", err)
        setLoading(false)
      }
    }

    fetchAndSubscribe()

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [])

  return { suppliers, loading }
}
