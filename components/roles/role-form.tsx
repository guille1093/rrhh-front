"use client"

import type React from "react"

import { useState } from "react"
import type { Role, RoleCreateRequest, RoleUpdateRequest } from "@/types/roles"
import { RolesAPI } from "@/lib/roles-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PermissionsSelector } from "./permissions-selector"
import { Loader2, Save, X } from "lucide-react"
import { toast } from "sonner"


interface RoleFormProps {
  role?: Role
  onSave: (role: Role) => void
  onCancel: () => void
  formRef?: React.RefObject<HTMLFormElement> | null
  loading?: boolean
  setLoading?: (v: boolean) => void
}

export function RoleForm({ role, onSave, onCancel, formRef, loading, setLoading }: Readonly<RoleFormProps>) {
  const [formData, setFormData] = useState({
    role: role?.role || "",
    description: role?.description || "",
    permissions: role?.permissions.map((p) => p.id) || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.role.trim()) {
      toast.error("El nombre del rol es requerido")
      return
    }

    if (formData.permissions.length === 0) {
      toast.error("Debe seleccionar al menos un permiso")
      return
    }

    try {
      setLoading?.(true)

      if (role) {
        // Update existing role
        const updateData: RoleUpdateRequest = {
          role: formData.role,
          permissions: formData.permissions,
        }
        const response = await RolesAPI.updateRole(role.id, updateData)
        onSave(response.data)
        toast.success("Rol actualizado correctamente")
      } else {
        // Create new role
        const createData: RoleCreateRequest = {
          role: formData.role,
          description: formData.description,
          permissions: formData.permissions,
        }
        const response = await RolesAPI.createRole(createData)
        onSave(response.data)
        toast.success("Rol creado correctamente")
      }
    } catch (error) {
      console.error("Error saving role:", error)
      toast.error("Error al guardar el rol")
    } finally {
      setLoading?.(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{role ? "Editar Rol" : "Crear Nuevo Rol"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Nombre del Rol</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Ej: ADMIN, MANAGER, USER"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del rol..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <PermissionsSelector
        selectedPermissions={formData.permissions}
        onPermissionsChange={(permissions) => setFormData({ ...formData, permissions })}
      />

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </form>
  )
}
