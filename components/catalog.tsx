"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Plus, Minus, Send } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useProducts } from "@/hooks/use-products"
import { getSettings } from "@/lib/settings"

export function Catalog() {
  const { products } = useProducts()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([])
  const [showOrderDialog, setShowOrderDialog] = useState(false)
  const [paymentDueDate, setPaymentDueDate] = useState("")
  const [whatsappNumber, setWhatsappNumber] = useState("+573001234567")

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await getSettings()
      setWhatsappNumber(settings.whatsappNumber)
    } catch (error) {
      console.error("[v0] Error loading settings:", error)
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        return prev.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing && existing.quantity > 1) {
        return prev.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item))
      }
      return prev.filter((item) => item.productId !== productId)
    })
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId)
      return total + (product?.price || 0) * item.quantity
    }, 0)
  }

  const handleOrder = () => {
    if (cart.length === 0) return

    const orderItems = cart.map((item) => {
      const product = products.find((p) => p.id === item.productId)!
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity,
      }
    })

    const isClient2 = user?.role === "client2"
    const needsDate = isClient2 && user?.canCreditPurchase

    if (needsDate && !paymentDueDate) {
      setShowOrderDialog(true)
      return
    }

    // Send WhatsApp message
    const message = `Hola! Soy ${user?.name}. Quiero hacer un pedido:\n\n${orderItems.map((item) => `${item.quantity}x ${item.productName} - ${formatCurrency(item.subtotal)}`).join("\n")}\n\nTotal: ${formatCurrency(getCartTotal())}`
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    setCart([])
    setPaymentDueDate("")
    setShowOrderDialog(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Catálogo de Productos</h2>
        <p className="text-muted-foreground">Selecciona los productos que deseas pedir</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Carrito: {cart.reduce((sum, item) => sum + item.quantity, 0)} items
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const cartItem = cart.find((item) => item.productId === product.id)
          return (
            <Card key={product.id}>
              <CardHeader>
                <div className="aspect-square relative mb-2 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={product.imageUrl || "/generic-product-display.png"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                <CardDescription>
                  <Badge variant="outline">{product.category}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-600">{formatCurrency(product.price)}</span>
                    <Badge variant={product.stock > product.minStock ? "secondary" : "destructive"}>
                      Stock: {product.stock}
                    </Badge>
                  </div>
                  {cartItem ? (
                    <div className="flex items-center justify-between">
                      <Button size="sm" variant="outline" onClick={() => removeFromCart(product.id)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold">{cartItem.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => addToCart(product.id)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => addToCart(product.id)} disabled={product.stock === 0}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Agregar al Carrito
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {cart.length > 0 && (
        <Card className="sticky bottom-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total del pedido</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(getCartTotal())}</p>
              </div>
              <Button size="lg" onClick={handleOrder}>
                <Send className="mr-2 h-4 w-4" />
                Enviar Pedido
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fecha de Pago</DialogTitle>
            <DialogDescription>Como cliente fiado, debes indicar la fecha en que pagarás este pedido</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Fecha de Pago</Label>
              <Input type="date" value={paymentDueDate} onChange={(e) => setPaymentDueDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleOrder} disabled={!paymentDueDate}>
              Confirmar Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
