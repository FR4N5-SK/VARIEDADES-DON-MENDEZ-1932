"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import type { StoreUser } from "@/lib/store"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Search, Shield, UserIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UsersManagement() {
  const { users, addUser, updateUser, deleteUser } = useStore()
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<StoreUser | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "cashier" as "admin" | "cashier" | "manager",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "cashier",
    })
  }

  const handleAdd = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    // Check if email already exists
    if (users.some((u) => u.email === formData.email)) {
      toast({
        title: "Error",
        description: "El correo electrónico ya está registrado",
        variant: "destructive",
      })
      return
    }

    addUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
    })

    toast({
      title: "Usuario agregado",
      description: `${formData.name} ha sido agregado al sistema`,
    })

    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEdit = () => {
    if (!selectedUser) return

    // Check if email already exists (excluding current user)
    if (users.some((u) => u.email === formData.email && u.id !== selectedUser.id)) {
      toast({
        title: "Error",
        description: "El correo electrónico ya está registrado",
        variant: "destructive",
      })
      return
    }

    updateUser(selectedUser.id, {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    })

    toast({
      title: "Usuario actualizado",
      description: `${formData.name} ha sido actualizado`,
    })

    resetForm()
    setIsEditDialogOpen(false)
    setSelectedUser(null)
  }

  const handleDelete = (user: StoreUser) => {
    if (user.id === currentUser?.id) {
      toast({
        title: "Error",
        description: "No puedes eliminar tu propio usuario",
        variant: "destructive",
      })
      return
    }

    if (confirm(`¿Estás seguro de eliminar a ${user.name}?`)) {
      deleteUser(user.id)
      toast({
        title: "Usuario eliminado",
        description: `${user.name} ha sido eliminado del sistema`,
      })
    }
  }

  const openEditDialog = (user: StoreUser) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "manager":
        return "default"
      case "cashier":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "manager":
        return "Gerente"
      case "cashier":
        return "Cajero"
      default:
        return role
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuarios</h2>
          <p className="text-muted-foreground">Gestión de personal del sistema</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
              <DialogDescription>Completa la información del usuario</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@donmendez.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "admin" | "cashier" | "manager") => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cashier">Cajero</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
                <p className="font-semibold mb-1">Permisos por rol:</p>
                <ul className="space-y-1 text-xs">
                  <li>
                    <strong>Cajero:</strong> Acceso a Panel Principal y Punto de Venta
                  </li>
                  <li>
                    <strong>Gerente:</strong> Cajero + Inventario, Proveedores y Ventas
                  </li>
                  <li>
                    <strong>Administrador:</strong> Acceso completo al sistema
                  </li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm()
                  setIsAddDialogOpen(false)
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
                Agregar Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Personal</CardTitle>
              <CardDescription>{filteredUsers.length} usuarios registrados</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Correo Electrónico</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              user.role === "admin"
                                ? "bg-red-100"
                                : user.role === "manager"
                                  ? "bg-blue-100"
                                  : "bg-gray-100"
                            }`}
                          >
                            {user.role === "admin" ? (
                              <Shield className="h-4 w-4 text-red-600" />
                            ) : (
                              <UserIcon className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            {user.id === currentUser?.id && (
                              <p className="text-xs text-muted-foreground">(Tu cuenta)</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleLabel(user.role)}</Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString("es-CO")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user)}
                            disabled={user.id === currentUser?.id}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Actualiza la información del usuario</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre Completo</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Correo Electrónico</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "cashier" | "manager") => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cashier">Cajero</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setIsEditDialogOpen(false)
                setSelectedUser(null)
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleEdit} className="bg-emerald-600 hover:bg-emerald-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
