"use client"

import { useState, useEffect } from "react"
import type { Permission } from "@/types/roles"
import { RolesAPI } from "@/lib/roles-api"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"

interface PermissionsSelectorProps {
  selectedPermissions: number[]
  onPermissionsChange: (permissions: number[]) => void
}

export function PermissionsSelector({ selectedPermissions, onPermissionsChange }: Readonly<PermissionsSelectorProps>) {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPermissions()
  }, [])

  const loadPermissions = async () => {
    try {
      setLoading(true)
      const response = await RolesAPI.getAllPermissions()
      setPermissions(response.data)
    } catch (err) {
      setError("Error al cargar permisos")
      console.error("Error loading permissions:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionToggle = (permissionId: number) => {
    const isSelected = selectedPermissions.includes(permissionId)
    if (isSelected) {
      onPermissionsChange(selectedPermissions.filter((id) => id !== permissionId))
    } else {
      onPermissionsChange([...selectedPermissions, permissionId])
    }
  }

  const groupPermissionsByCategory = (permissions: Permission[]) => {
    const groups: { [key: string]: Permission[] } = {}

    permissions.forEach((permission) => {
      const category = permission.permission.split(":")[1] || "otros"
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(permission)
    })

    return groups
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permisos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Cargando permisos...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permisos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center py-4">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const groupedPermissions = groupPermissionsByCategory(permissions)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Permisos
          <Badge variant="secondary">{selectedPermissions.length} seleccionados</Badge>
        </CardTitle>
        <Button
          variant="outline"
          onClick={() => {
            const allPermissionIds = permissions.map((p) => p.id)
            onPermissionsChange(allPermissionIds)
          }}
        >
          Marcar todos
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
              {category.replace("-", " ")}
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {categoryPermissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`permission-${permission.id}`}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={`permission-${permission.id}`} className="text-sm font-medium cursor-pointer">
                      {permission.permission}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
