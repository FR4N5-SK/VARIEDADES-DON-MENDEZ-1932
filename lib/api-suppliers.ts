import { createBrowserClient } from "@supabase/ssr"
import type { Supplier } from "@/lib/store"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function addSupplierToSupabase(supplier: Omit<Supplier, "id" | "createdAt">) {
  const { data, error } = await supabase.from("suppliers").insert([supplier]).select()

  if (error) throw error
  return data?.[0]
}

export async function updateSupplierInSupabase(id: string, supplier: Partial<Supplier>) {
  const { data, error } = await supabase.from("suppliers").update(supplier).eq("id", id).select()

  if (error) throw error
  return data?.[0]
}

export async function deleteSupplierFromSupabase(id: string) {
  const { error } = await supabase.from("suppliers").delete().eq("id", id)

  if (error) throw error
}
