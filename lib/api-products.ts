import { createBrowserClient } from "@supabase/ssr"
import type { Product } from "@/lib/store"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function addProductToSupabase(product: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        code: product.code,
        name: product.name,
        image_url: product.imageUrl,
        category: product.category,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        min_stock: product.minStock,
        supplier_id: product.supplierId,
      },
    ])
    .select()

  if (error) {
    console.error("[v0] Error adding product:", error)
    throw error
  }

  return data?.[0]
}

export async function updateProductInSupabase(id: string, product: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .update({
      code: product.code,
      name: product.name,
      image_url: product.imageUrl,
      category: product.category,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      min_stock: product.minStock,
      supplier_id: product.supplierId,
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("[v0] Error updating product:", error)
    throw error
  }

  return data?.[0]
}

export async function deleteProductFromSupabase(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting product:", error)
    throw error
  }
}
