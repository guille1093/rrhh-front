"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEmployees, deleteEmployee } from "@/lib/employees-api"
import type { Employee } from "@/types/employee"
import { Eye, Pencil, Trash2 } from "lucide-react"

export function EmployeesTable() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  useEffect(() => {
    loadEmployees()
  }, [currentPage, searchTerm])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const response = await getEmployees({
        offset: currentPage * pageSize,
        pageSize,
        firstName: searchTerm || undefined,
        orderBy: "id",
        orderType: "DESC",
      })
      setEmployees(response.data.results)
      setTotal(response.data.total)
    } catch (error) {
      console.error("[v0] Failed to load employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este empleado?")) return
    try {
      await deleteEmployee(id)
      loadEmployees()
    } catch (error) {
      console.error("[v0] Failed to delete employee:", error)
      alert("Error al eliminar el empleado")
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Empleados</CardTitle>
          <Link href="/dashboard/employees/create">
            <Button>Crear Empleado</Button>
          </Link>
        </div>
        <div className="mt-4">
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(0)
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Puesto</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.position.name}</TableCell>
                    <TableCell>{employee.position.department.name}</TableCell>
                    <TableCell>{employee.position.department.area.name}</TableCell>
                    <TableCell>{employee.position.department.area.company.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/employees/${employee.id}/profile`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/employees/${employee.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {currentPage * pageSize + 1} a {Math.min((currentPage + 1) * pageSize, total)} de {total}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
