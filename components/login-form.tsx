"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Store } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LoginForm() {
  // Login state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Register state
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regAddress, setRegAddress] = useState("")
  const [regError, setRegError] = useState("")
  const [regSuccess, setRegSuccess] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)

  const { login, register } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(email, password)

    if (!success) {
      setError("Credenciales incorrectas. Intenta de nuevo.")
    }

    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError("")
    setRegSuccess("")
    setIsRegistering(true)

    const result = await register(regName, regEmail, regPassword, regPhone, regAddress)

    if (result.success) {
      setRegSuccess("¡Registro exitoso! Ya puedes iniciar sesión.")
      setRegName("")
      setRegEmail("")
      setRegPassword("")
      setRegPhone("")
      setRegAddress("")
    } else {
      setRegError(result.error || "Error en el registro")
    }

    setIsRegistering(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-600 p-3 rounded-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Variedades Don Mendez</CardTitle>
          <CardDescription>Sistema de Gestión 1932</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@donmendez.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nombre Completo</Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    disabled={isRegistering}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Correo Electrónico</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    disabled={isRegistering}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Contraseña</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    disabled={isRegistering}
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Teléfono (Opcional)</Label>
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="+57 300 1234567"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    disabled={isRegistering}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-address">Dirección (Opcional)</Label>
                  <Input
                    id="reg-address"
                    type="text"
                    placeholder="Calle 123 #45-67"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    disabled={isRegistering}
                  />
                </div>
                {regError && (
                  <Alert variant="destructive">
                    <AlertDescription>{regError}</AlertDescription>
                  </Alert>
                )}
                {regSuccess && (
                  <Alert className="bg-emerald-50 border-emerald-200">
                    <AlertDescription className="text-emerald-800">{regSuccess}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isRegistering}>
                  {isRegistering ? "Registrando..." : "Registrarse"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
