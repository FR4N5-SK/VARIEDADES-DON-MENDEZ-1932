"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Settings() {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.from("settings").select("whatsapp_number").limit(1).single()

      if (error) throw error

      if (data) {
        setWhatsappNumber(data.whatsapp_number)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setFetching(false)
    }
  }

  const handleSave = async () => {
    if (!whatsappNumber.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número de WhatsApp",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Check if settings exist
      const { data: existing } = await supabase.from("settings").select("id").limit(1).single()

      if (existing) {
        // Update existing settings
        const { error } = await supabase
          .from("settings")
          .update({ whatsapp_number: whatsappNumber, updated_at: new Date().toISOString() })
          .eq("id", existing.id)

        if (error) throw error
      } else {
        // Insert new settings
        const { error } = await supabase.from("settings").insert({ whatsapp_number: whatsappNumber })

        if (error) throw error
      }

      toast({
        title: "Configuración guardada",
        description: "El número de WhatsApp ha sido actualizado",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">Configura los ajustes del sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp</CardTitle>
          <CardDescription>Número de WhatsApp para recibir pedidos de clientes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Número de WhatsApp</Label>
            <Input
              placeholder="+57 300 123 4567"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">Incluye el código de país (ej: +57 para Colombia)</p>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <SettingsIcon className="mr-2 h-4 w-4" />
                Guardar Configuración
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
