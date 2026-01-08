"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Printer } from "lucide-react"

export function PriceCalculator() {
  const [cost, setCost] = useState("")
  const [marginPercent, setMarginPercent] = useState("")
  const [desiredPrice, setDesiredPrice] = useState("")

  const [printMode, setPrintMode] = useState<"all" | "category" | "single">("all")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const products = useStore((state) => state.products)
  const categories = Array.from(new Set(products.map((p) => p.category)))

  const calculatePrice = () => {
    if (!cost || !marginPercent) return 0
    const costNum = Number.parseFloat(cost)
    const marginNum = Number.parseFloat(marginPercent)
    return costNum * (1 + marginNum / 100)
  }

  const calculateMargin = () => {
    if (!cost || !desiredPrice) return 0
    const costNum = Number.parseFloat(cost)
    const priceNum = Number.parseFloat(desiredPrice)
    return ((priceNum - costNum) / costNum) * 100
  }

  const calculateProfit = () => {
    if (!cost || !marginPercent) return 0
    const costNum = Number.parseFloat(cost)
    const price = calculatePrice()
    return price - costNum
  }

  const getProductsToPrint = () => {
    if (printMode === "all") return products
    if (printMode === "category") return products.filter((p) => p.category === selectedCategory)
    return products.filter((p) => selectedProducts.includes(p.id))
  }

  const handlePrint = () => {
    const productsToPrint = getProductsToPrint()

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiquetas de Precios - Variedades Don Mendez</title>
          <style>
            @page {
              size: letter;
              margin: 0.5cm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 10px;
            }
            .labels-container {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
            }
            .label {
              border: 2px solid #1e40af;
              border-radius: 8px;
              padding: 15px;
              page-break-inside: avoid;
              background: white;
              min-height: 120px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .label-header {
              background: #1e40af;
              color: white;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: bold;
              text-align: center;
              margin: -15px -15px 10px -15px;
            }
            .product-name {
              font-size: 14px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 5px;
            }
            .product-code {
              font-size: 10px;
              color: #666;
              margin-bottom: 8px;
            }
            .price {
              font-size: 28px;
              font-weight: bold;
              color: #16a34a;
              text-align: center;
              margin: 10px 0;
            }
            .category {
              font-size: 10px;
              color: #666;
              background: #f1f5f9;
              padding: 3px 8px;
              border-radius: 3px;
              display: inline-block;
            }
            @media print {
              .labels-container {
                grid-template-columns: repeat(3, 1fr);
              }
            }
          </style>
        </head>
        <body>
          <div class="labels-container">
            ${productsToPrint
              .map(
                (product) => `
              <div class="label">
                <div class="label-header">VARIEDADES DON MENDEZ 1932</div>
                <div>
                  <div class="product-name">${product.name}</div>
                  <div class="product-code">Código: ${product.code}</div>
                  <div class="price">${formatCurrency(product.price)}</div>
                </div>
                <div class="category">${product.category}</div>
              </div>
            `,
              )
              .join("")}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Calculadora de Precios</h2>
        <p className="text-muted-foreground">Calcula el precio de venta e imprime etiquetas de precios</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calcular Precio de Venta</CardTitle>
            <CardDescription>A partir del costo y margen de ganancia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Costo del Producto</Label>
              <Input type="number" placeholder="0" value={cost} onChange={(e) => setCost(e.target.value)} />
            </div>
            <div>
              <Label>Margen de Ganancia (%)</Label>
              <Input
                type="number"
                placeholder="0"
                value={marginPercent}
                onChange={(e) => setMarginPercent(e.target.value)}
              />
            </div>
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio de Venta:</span>
                <span className="text-2xl font-bold text-emerald-600">{formatCurrency(calculatePrice())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ganancia:</span>
                <span className="font-semibold">{formatCurrency(calculateProfit())}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calcular Margen</CardTitle>
            <CardDescription>A partir del costo y precio de venta deseado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Costo del Producto</Label>
              <Input type="number" placeholder="0" value={cost} onChange={(e) => setCost(e.target.value)} />
            </div>
            <div>
              <Label>Precio de Venta Deseado</Label>
              <Input
                type="number"
                placeholder="0"
                value={desiredPrice}
                onChange={(e) => setDesiredPrice(e.target.value)}
              />
            </div>
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margen de Ganancia:</span>
                <span className="text-2xl font-bold text-blue-600">{calculateMargin().toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ganancia:</span>
                <span className="font-semibold">
                  {formatCurrency(Number.parseFloat(desiredPrice || "0") - Number.parseFloat(cost || "0"))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ejemplos de Márgenes Comunes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {[
              { margin: 20, description: "Margen bajo - Productos de alta rotación" },
              { margin: 30, description: "Margen estándar - Productos generales" },
              { margin: 50, description: "Margen medio - Productos especializados" },
              { margin: 100, description: "Margen alto - Productos premium" },
            ].map((example) => (
              <Card key={example.margin}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{example.margin}%</p>
                      <p className="text-sm text-muted-foreground">{example.description}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setMarginPercent(example.margin.toString())}>
                      Usar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Imprimir Etiquetas de Precios
          </CardTitle>
          <CardDescription>Genera e imprime etiquetas de precios para tus productos (tamaño carta)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Modo de Impresión</Label>
            <Select value={printMode} onValueChange={(value: any) => setPrintMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los productos</SelectItem>
                <SelectItem value="category">Por categoría</SelectItem>
                <SelectItem value="single">Productos específicos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {printMode === "category" && (
            <div>
              <Label>Seleccionar Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Elige una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {printMode === "single" && (
            <div>
              <Label>Seleccionar Productos</Label>
              <div className="border rounded-md p-4 max-h-64 overflow-y-auto space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={product.id}
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts([...selectedProducts, product.id])
                        } else {
                          setSelectedProducts(selectedProducts.filter((id) => id !== product.id))
                        }
                      }}
                    />
                    <label htmlFor={product.id} className="text-sm cursor-pointer">
                      {product.name} - {formatCurrency(product.price)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              {printMode === "all" && `Se imprimirán ${products.length} etiquetas`}
              {printMode === "category" &&
                selectedCategory &&
                `Se imprimirán ${products.filter((p) => p.category === selectedCategory).length} etiquetas`}
              {printMode === "single" && `Se imprimirán ${selectedProducts.length} etiquetas`}
            </p>
            <Button
              onClick={handlePrint}
              className="w-full"
              disabled={
                (printMode === "category" && !selectedCategory) ||
                (printMode === "single" && selectedProducts.length === 0)
              }
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir Etiquetas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
