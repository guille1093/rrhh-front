"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmployees, deleteEmployee } from "@/lib/employees-api";
import type { Employee } from "@/types/employee";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { CompaniesAPI } from "@/lib/companies-api";
import { AreasAPI } from "@/lib/areas-api";
import { DepartmentsAPI } from "@/lib/departments-api";
import { PositionsAPI } from "@/lib/positions-api";

export function EmployeesTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Filtros
  const [companies, setCompanies] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  );
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(
    null,
  );

  // Cargar empresas al montar y seleccionar la primera por defecto
  useEffect(() => {
    CompaniesAPI.getCompanies({ pageSize: 100 }).then((res) => {
      setCompanies(res.data.results);
      if (res.data.results.length > 0) {
        setSelectedCompanyId(res.data.results[0].id);
      }
    });
  }, []);

  // Cargar áreas cuando cambia empresa
  useEffect(() => {
    if (selectedCompanyId) {
      AreasAPI.getAreas({ companyId: selectedCompanyId, pageSize: 100 }).then(
        (res) => {
          setAreas(res.data.results);
        },
      );
    } else {
      setAreas([]);
    }
    setSelectedAreaId(null);
    setSelectedDepartmentId(null);
    setSelectedPositionId(null);
    setDepartments([]);
    setPositions([]);
  }, [selectedCompanyId]);

  // Cargar departamentos cuando cambia área
  useEffect(() => {
    if (selectedAreaId) {
      DepartmentsAPI.getDepartments({
        areaId: selectedAreaId,
        pageSize: 100,
      }).then((res) => {
        setDepartments(res.data.results);
      });
    } else {
      setDepartments([]);
    }
    setSelectedDepartmentId(null);
    setSelectedPositionId(null);
    setPositions([]);
  }, [selectedAreaId]);

  // Cargar puestos cuando cambia departamento
  useEffect(() => {
    if (selectedDepartmentId) {
      PositionsAPI.getPositions({
        departmentId: selectedDepartmentId,
        pageSize: 100,
      }).then((res) => {
        setPositions(res.data.results);
      });
    } else {
      setPositions([]);
    }
    setSelectedPositionId(null);
  }, [selectedDepartmentId]);

  // Recargar empleados cuando cambian filtros
  useEffect(() => {
    loadEmployees();
  }, [
    currentPage,
    searchTerm,
    selectedCompanyId,
    selectedAreaId,
    selectedDepartmentId,
    selectedPositionId,
  ]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees({
        offset: currentPage * pageSize,
        pageSize,
        firstName: searchTerm || undefined,
        orderBy: "id",
        orderType: "DESC",
        companyId: selectedCompanyId || undefined,
        areaId: selectedAreaId || undefined,
        departmentId: selectedDepartmentId || undefined,
        positionId: selectedPositionId || undefined,
      });
      setEmployees(response.data.results);
      setTotal(response.data.total);
    } catch (error) {
      console.error("[v0] Failed to load employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar este empleado?")) return;
    try {
      await deleteEmployee(id);
      loadEmployees();
    } catch (error) {
      console.error("[v0] Failed to delete employee:", error);
      alert("Error al eliminar el empleado");
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Empleados</CardTitle>
          <Link href="/dashboard/employees/create">
            <Button>Crear Empleado</Button>
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-2">
          <div>
            <label className="block text-xs font-semibold mb-1">Empresa</label>
            <Select
              value={selectedCompanyId?.toString() || ""}
              onValueChange={(val) => setSelectedCompanyId(Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Área</label>
            <Select
              value={selectedAreaId?.toString() || "all"}
              onValueChange={(val) =>
                setSelectedAreaId(val === "all" ? null : Number(val))
              }
              disabled={!selectedCompanyId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {areas.map((a) => (
                  <SelectItem key={a.id} value={a.id.toString()}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Departamento
            </label>
            <Select
              value={selectedDepartmentId?.toString() || "all"}
              onValueChange={(val) =>
                setSelectedDepartmentId(val === "all" ? null : Number(val))
              }
              disabled={!selectedAreaId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Puesto</label>
            <Select
              value={selectedPositionId?.toString() || "all"}
              onValueChange={(val) =>
                setSelectedPositionId(val === "all" ? null : Number(val))
              }
              disabled={!selectedDepartmentId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Puesto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {positions.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Buscar por nombre
            </label>
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
            />
          </div>
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
                    <TableCell>
                      {employee.position.department.area.name}
                    </TableCell>
                    <TableCell>
                      {employee.position.department.area.company.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/employees/${employee.id}/profile`}
                        >
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/employees/${employee.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(employee.id)}
                        >
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
                Mostrando {currentPage * pageSize + 1} a{" "}
                {Math.min((currentPage + 1) * pageSize, total)} de {total}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 0}
                >
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
  );
}
