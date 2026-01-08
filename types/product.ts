export interface Product {
  id: string
  code: string
  name: string
  imageUrl: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  supplierId: string
  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  address: string
  createdAt: string
}
