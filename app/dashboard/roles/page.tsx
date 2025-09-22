"use client"

import { useState, useEffect } from "react"
import type { Role } from "@/types/roles"
import { RolesAPI } from "@/lib/roles-api"
import { RolesTable } from "@/components/roles/roles-table"
import { RouteGuard } from "@/components/auth/route-guard"
import { toast } from "sonner"

type ViewMode = "list" | "create" | "edit"

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 7,
    offset: 0,
  })

  useEffect(() => {
    loadRoles()
  }, [pagination.offset])

  const loadRoles = async () => {
    try {
      setLoading(true)
      const response = await RolesAPI.getRoles({
        orderBy: "id",
        orderType: "ASC",
        offset: pagination.offset,
        pageSize: pagination.pageSize,
      })
      setRoles(response.data.results)
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
      }))
    } catch (error) {
      console.error("Error loading roles:", error)
      toast.error("Error al cargar los roles")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <RouteGuard requiredPermission="read:roles">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p>Cargando roles...</p>
            </div>
          </div>
        </div>
      </RouteGuard>
    )
  }

  return (
  <RouteGuard requiredPermission="read:roles">
        <RolesTable data={roles} />
    </RouteGuard>
  )
}
