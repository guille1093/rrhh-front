"use client"

import type { Role } from "@/types/roles"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RoleDetailsModalProps {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoleDetailsModal({ role, open, onOpenChange }: Readonly<RoleDetailsModalProps>) {
  if (!role) return null

  const groupPermissionsByCategory = (permissions: typeof role.permissions) => {
    const groups: { [key: string]: typeof role.permissions } = {}

    permissions.forEach((permission) => {
      const category = permission.permission.split(":")[1] || "otros"
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(permission)
    })

    return groups
  }

  const groupedPermissions = groupPermissionsByCategory(role.permissions)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Detalles del Rol</span>
            <Badge variant="secondary">{role.role}</Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">ID:</span>
                  <span className="ml-2">{role.id}</span>
                </div>
                <div>
                  <span className="font-medium">Nombre:</span>
                  <span className="ml-2">{role.role}</span>
                </div>
                <div>
                  <span className="font-medium">Descripción:</span>
                  <span className="ml-2">{role.description}</span>
                </div>
                <div>
                  <span className="font-medium">Total de Permisos:</span>
                  <Badge variant="outline" className="ml-2">
                    {role.permissions.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Permisos Asignados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                        {category.replace("-", " ")}
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {categoryPermissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-muted/20"
                          >
                            <div>
                              <div className="font-medium text-sm">{permission.permission}</div>
                              <div className="text-xs text-muted-foreground">{permission.description}</div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              ID: {permission.id}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
