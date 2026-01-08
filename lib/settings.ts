import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("whatsapp_number").limit(1).single()

  if (error) {
    console.error("[v0] Error fetching settings:", error)
    return { whatsappNumber: "+573001234567" }
  }

  return {
    whatsappNumber: data?.whatsapp_number || "+573001234567",
  }
}

export async function updateSettings(whatsappNumber: string) {
  const { data: existing } = await supabase.from("settings").select("id").limit(1).single()

  if (existing) {
    const { error } = await supabase
      .from("settings")
      .update({ whatsapp_number: whatsappNumber, updated_at: new Date().toISOString() })
      .eq("id", existing.id)

    if (error) throw error
  } else {
    const { error } = await supabase.from("settings").insert({ whatsapp_number: whatsappNumber })

    if (error) throw error
  }
}

export const settings = {
  whatsappNumber: "+573001234567",
}
