"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { Product } from "@/lib/store"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    let subscription: any

    const fetchAndSubscribe = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })

        if (fetchError) throw fetchError

        const mappedProducts = (data || []).map((p: any) => ({
          id: p.id,
          code: p.code,
          name: p.name,
          imageUrl: p.image_url,
          category: p.category,
          price: p.price,
          cost: p.cost,
          stock: p.stock,
          minStock: p.min_stock,
          supplierId: p.supplier_id,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }))

        setProducts(mappedProducts)

        subscription = supabase
          .channel("products")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "products",
            },
            (payload: any) => {
              if (payload.eventType === "INSERT") {
                const newProduct = {
                  id: payload.new.id,
                  code: payload.new.code,
                  name: payload.new.name,
                  imageUrl: payload.new.image_url,
                  category: payload.new.category,
                  price: payload.new.price,
                  cost: payload.new.cost,
                  stock: payload.new.stock,
                  minStock: payload.new.min_stock,
                  supplierId: payload.new.supplier_id,
                  createdAt: payload.new.created_at,
                  updatedAt: payload.new.updated_at,
                }
                setProducts((prev) => [newProduct, ...prev])
              } else if (payload.eventType === "UPDATE") {
                setProducts((prev) =>
                  prev.map((p) =>
                    p.id === payload.new.id
                      ? {
                          id: payload.new.id,
                          code: payload.new.code,
                          name: payload.new.name,
                          imageUrl: payload.new.image_url,
                          category: payload.new.category,
                          price: payload.new.price,
                          cost: payload.new.cost,
                          stock: payload.new.stock,
                          minStock: payload.new.min_stock,
                          supplierId: payload.new.supplier_id,
                          createdAt: payload.new.created_at,
                          updatedAt: payload.new.updated_at,
                        }
                      : p,
                  ),
                )
              } else if (payload.eventType === "DELETE") {
                setProducts((prev) => prev.filter((p) => p.id !== payload.old.id))
              }
            },
          )
          .subscribe()

        setLoading(false)
      } catch (err) {
        console.error("[v0] Error fetching products:", err)
        setError(err instanceof Error ? err.message : "Error loading products")
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

  return { products, loading, error }
}
