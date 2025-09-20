"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Building, FileText, BarChart3 } from "lucide-react"

const getPermissionIcon = (permission: string) => {
  if (permission.includes("users")) return <Users className="h-4 w-4" />
  if (permission.includes("roles")) return <Shield className="h-4 w-4" />
  if (permission.includes("companies") || permission.includes("areas") || permission.includes("departments"))
    return <Building className="h-4 w-4" />
  if (permission.includes("reports")) return <BarChart3 className="h-4 w-4" />
  return <FileText className="h-4 w-4" />
}

const getPermissionColor = (permission: string) => {
  if (permission.includes("create")) return "bg-green-100 text-green-800 border-green-200"
  if (permission.includes("read")) return "bg-blue-100 text-blue-800 border-blue-200"
  if (permission.includes("update")) return "bg-yellow-100 text-yellow-800 border-yellow-200"
  if (permission.includes("delete")) return "bg-red-100 text-red-800 border-red-200"
  return "bg-gray-100 text-gray-800 border-gray-200"
}

export function PermissionsCard() {
  const { user } = useAuth()

  if (!user?.role?.permissions) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permisos del Usuario
        </CardTitle>
        <CardDescription>Permisos asignados a tu rol: {user.role.role}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {user.role.permissions.map((permission) => (
            <div key={permission.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                {getPermissionIcon(permission.permission)}
                <div>
                  <p className="font-medium text-sm">{permission.permission}</p>
                  <p className="text-xs text-muted-foreground">{permission.description}</p>
                </div>
              </div>
              <Badge variant="outline" className={getPermissionColor(permission.permission)}>
                {permission.permission.split(":")[0]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
