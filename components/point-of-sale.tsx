"use client"

import { useState } from "react"
import { useProducts } from "@/hooks/use-products"
import type { Product } from "@/lib/store"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Minus, Trash2, ShoppingCart, X, DollarSign, CreditCard, Banknote } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  product: Product
  quantity: number
}

export function PointOfSale() {
  const { products } = useProducts()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory && product.stock > 0
  })

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id)

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Stock insuficiente",
          description: `Solo hay ${product.stock} unidades disponibles`,
          variant: "destructive",
        })
        return
      }
      setCart(cart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    const item = cart.find((item) => item.product.id === productId)
    if (item && newQuantity > item.product.stock) {
      toast({
        title: "Stock insuficiente",
        description: `Solo hay ${item.product.stock} unidades disponibles`,
        variant: "destructive",
      })
      return
    }

    setCart(cart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }

  const processSale = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito para procesar la venta",
        variant: "destructive",
      })
      return
    }

    // Create sale
    const sale = {
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity,
      })),
      total: calculateTotal(),
      paymentMethod,
      cashierId: user?.id || "",
      cashierName: user?.name || "",
    }

    // Placeholder for adding sale logic
    console.log("Sale processed:", sale)

    // Update stock
    cart.forEach((item) => {
      // Placeholder for updating product stock logic
      console.log("Update stock for product:", item.product.id, "New stock:", item.product.stock - item.quantity)
    })

    toast({
      title: "Venta completada",
      description: `Venta por ${formatCurrency(sale.total)} registrada exitosamente`,
    })

    // Reset cart
    setCart([])
    setPaymentMethod("cash")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Punto de Venta</h2>
        <p className="text-muted-foreground">Sistema de cobro y registro de ventas</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos Disponibles</CardTitle>
              <CardDescription>Selecciona productos para agregar al carrito</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o código..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat === "all" ? "Todas las categorías" : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No hay productos disponibles</div>
                  ) : (
                    filteredProducts.map((product) => (
                      <Card key={product.id} className="cursor-pointer hover:border-emerald-500 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                              <img
                                src={product.imageUrl || "/generic-product-display.png"}
                                alt={product.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{product.name}</p>
                                <Badge variant="outline" className="text-xs">
                                  {product.code}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-lg font-bold text-emerald-600">{formatCurrency(product.price)}</p>
                                <Badge variant={product.stock <= product.minStock ? "destructive" : "secondary"}>
                                  Stock: {product.stock}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              onClick={() => addToCart(product)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                              size="icon"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <CardTitle>Carrito</CardTitle>
                </div>
                {cart.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setCart([])}>
                    <X className="h-4 w-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>
              <CardDescription>{cart.length} productos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>El carrito está vacío</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <Card key={item.product.id}>
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <p className="font-medium text-sm">{item.product.name}</p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => removeFromCart(item.product.id)}
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 bg-transparent"
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 bg-transparent"
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <p className="font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Método de Pago</p>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={paymentMethod === "cash" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPaymentMethod("cash")}
                            className={
                              paymentMethod === "cash"
                                ? "bg-emerald-600 hover:bg-emerald-700 flex-col h-auto py-2"
                                : "flex-col h-auto py-2"
                            }
                          >
                            <Banknote className="h-4 w-4 mb-1" />
                            <span className="text-xs">Efectivo</span>
                          </Button>
                          <Button
                            variant={paymentMethod === "card" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPaymentMethod("card")}
                            className={
                              paymentMethod === "card"
                                ? "bg-emerald-600 hover:bg-emerald-700 flex-col h-auto py-2"
                                : "flex-col h-auto py-2"
                            }
                          >
                            <CreditCard className="h-4 w-4 mb-1" />
                            <span className="text-xs">Tarjeta</span>
                          </Button>
                          <Button
                            variant={paymentMethod === "transfer" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPaymentMethod("transfer")}
                            className={
                              paymentMethod === "transfer"
                                ? "bg-emerald-600 hover:bg-emerald-700 flex-col h-auto py-2"
                                : "flex-col h-auto py-2"
                            }
                          >
                            <DollarSign className="h-4 w-4 mb-1" />
                            <span className="text-xs">Transfer</span>
                          </Button>
                        </div>
                      </div>

                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total</span>
                          <span className="text-2xl font-bold text-emerald-600">
                            {formatCurrency(calculateTotal())}
                          </span>
                        </div>
                      </div>

                      <Button onClick={processSale} className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                        Procesar Venta
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
