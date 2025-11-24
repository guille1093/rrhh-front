"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getEmployee } from "@/lib/employees-api"
import {
  createContract,
  updateContract,
  deleteContract,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
} from "@/lib/employees-api"
import type {
  Employee,
  Contract,
  HealthRecord,
  Evaluation,
  EmergencyContact,
  FamilyMember,
  Request,
} from "@/types/employee"
import { Pencil, Trash2, Plus } from "lucide-react"

interface EmployeeProfileProps {
  employeeId: number
}

export function EmployeeProfile({ employeeId }: EmployeeProfileProps) {
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEmployee()
  }, [employeeId])

  const loadEmployee = async () => {
    try {
      setLoading(true)
      const response = await getEmployee(employeeId)
      setEmployee(response.data)
    } catch (error) {
      console.error("[v0] Failed to load employee:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !employee) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="text-muted-foreground">
            {employee.position.name} - {employee.position.department.name}
          </p>
        </div>
        <Button onClick={() => router.push(`/dashboard/employees/${employeeId}/edit`)}>
          Editar Información Básica
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{employee.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Teléfono</p>
            <p className="font-medium">{employee.phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Documento</p>
            <p className="font-medium">
              {employee.documentType} {employee.documentNumber || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">CUIL</p>
            <p className="font-medium">{employee.cuil || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
            <p className="font-medium">{employee.birthDate || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nacionalidad</p>
            <p className="font-medium">{employee.nationality || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Género</p>
            <p className="font-medium">{employee.gender || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estado Civil</p>
            <p className="font-medium">{employee.civilStatus || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="health">Salud</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluaciones</TabsTrigger>
          <TabsTrigger value="emergency">Emergencia</TabsTrigger>
          <TabsTrigger value="family">Familiares</TabsTrigger>
          <TabsTrigger value="requests">Solicitudes</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts">
          <ContractsTab employeeId={employeeId} contracts={employee.contracts} onUpdate={loadEmployee} />
        </TabsContent>

        <TabsContent value="health">
          <HealthRecordsTab employeeId={employeeId} records={employee.healthRecords} onUpdate={loadEmployee} />
        </TabsContent>

        <TabsContent value="evaluations">
          <EvaluationsTab employeeId={employeeId} evaluations={employee.evaluations} onUpdate={loadEmployee} />
        </TabsContent>

        <TabsContent value="emergency">
          <EmergencyContactsTab employeeId={employeeId} contacts={employee.emergencyContacts} onUpdate={loadEmployee} />
        </TabsContent>

        <TabsContent value="family">
          <FamilyMembersTab employeeId={employeeId} members={employee.familyMembers} onUpdate={loadEmployee} />
        </TabsContent>

        <TabsContent value="requests">
          <RequestsTab employeeId={employeeId} requests={employee.requests} onUpdate={loadEmployee} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Contracts Tab
function ContractsTab({
  employeeId,
  contracts,
  onUpdate,
}: { employeeId: number; contracts: Contract[]; onUpdate: () => void }) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    contractType: "",
    startDate: "",
    endDate: "",
    workSchedule: "",
    salary: "",
    compensation: "",
  })

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateContract(editingId, { ...formData, salary: Number(formData.salary) })
      } else {
        await createContract({ ...formData, employeeId, salary: Number(formData.salary) })
      }
      setOpen(false)
      setEditingId(null)
      setFormData({ contractType: "", startDate: "", endDate: "", workSchedule: "", salary: "", compensation: "" })
      onUpdate()
    } catch (error) {
      console.error("[v0] Failed to save contract:", error)
    }
  }

  const handleEdit = (contract: Contract) => {
    setEditingId(contract.id)
    setFormData({
      contractType: contract.contractType,
      startDate: contract.startDate,
      endDate: contract.endDate || "",
      workSchedule: contract.workSchedule || "",
      salary: contract.salary,
      compensation: contract.compensation || "",
    })
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este contrato?")) return
    try {
      await deleteContract(id)
      onUpdate()
    } catch (error) {
      console.error("[v0] Failed to delete contract:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Contratos</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditingId(null)
                  setFormData({
                    contractType: "",
                    startDate: "",
                    endDate: "",
                    workSchedule: "",
                    salary: "",
                    compensation: "",
                  })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Contrato
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar" : "Nuevo"} Contrato</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Contrato</Label>
                  <Input
                    value={formData.contractType}
                    onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha Inicio</Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha Fin</Label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Horario</Label>
                  <Input
                    value={formData.workSchedule}
                    onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Salario</Label>
                  <Input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Compensación</Label>
                  <Input
                    value={formData.compensation}
                    onChange={(e) => setFormData({ ...formData, compensation: e.target.value })}
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Inicio</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Salario</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{contract.contractType}</TableCell>
                <TableCell>{contract.startDate}</TableCell>
                <TableCell>{contract.endDate || "N/A"}</TableCell>
                <TableCell>${contract.salary}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(contract)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(contract.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Health Records Tab
function HealthRecordsTab({
  employeeId,
  records,
  onUpdate,
}: { employeeId: number; records: HealthRecord[]; onUpdate: () => void }) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    type: "",
    result: "",
    realizationDate: "",
    expirationDate: "",
  })

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateHealthRecord(editingId, formData)
      } else {
        await createHealthRecord({ ...formData, employeeId })
      }
      setOpen(false)
      setEditingId(null)
      setFormData({ type: "", result: "", realizationDate: "", expirationDate: "" })
      onUpdate()
    } catch (error) {
      console.error("[v0] Failed to save health record:", error)
    }
  }

  const handleEdit = (record: HealthRecord) => {
    setEditingId(record.id)
    setFormData({
      type: record.type,
      result: record.result,
      realizationDate: record.realizationDate,
      expirationDate: record.expirationDate,
    })
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este registro?")) return
    try {
      await deleteHealthRecord(id)
      onUpdate()
    } catch (error) {
      console.error("[v0] Failed to delete health record:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Registros de Salud</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditingId(null)
                  setFormData({ type: "", result: "", realizationDate: "", expirationDate: "" })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Registro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar" : "Nuevo"} Registro de Salud</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pre-ocupacional">Pre-ocupacional</SelectItem>
                      <SelectItem value="Periódico">Periódico</SelectItem>
                      <SelectItem value="Post-ocupacional">Post-ocupacional</SelectItem>
                      <SelectItem value="Retorno al trabajo">Retorno al trabajo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Resultado</Label>
                  <Select
                    value={formData.result}
                    onValueChange={(value) => setFormData({ ...formData, result: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apto">Apto</SelectItem>
                      <SelectItem value="Apto con preexistencias">Apto con preexistencias</SelectItem>
                      <SelectItem value="No Apto">No Apto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha Realización</Label>
                    <Input
                      type="date"
                      value={formData.realizationDate}
                      onChange={(e) => setFormData({ ...formData, realizationDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha Vencimiento</Label>
                    <Input
                      type="date"
                      value={formData.expirationDate}
                      onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead>Realización</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.result}</TableCell>
                <TableCell>{record.realizationDate}</TableCell>
                <TableCell>{record.expirationDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(record)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Evaluations Tab (similar structure to above)
function EvaluationsTab({
  employeeId,
  evaluations,
  onUpdate,
}: { employeeId: number; evaluations: Evaluation[]; onUpdate: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluaciones de Desempeño</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Implementación similar a Contratos y Salud</p>
      </CardContent>
    </Card>
  )
}

// Emergency Contacts Tab
function EmergencyContactsTab({
  employeeId,
  contacts,
  onUpdate,
}: { employeeId: number; contacts: EmergencyContact[]; onUpdate: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contactos de Emergencia</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Implementación similar a Contratos y Salud</p>
      </CardContent>
    </Card>
  )
}

// Family Members Tab
function FamilyMembersTab({
  employeeId,
  members,
  onUpdate,
}: { employeeId: number; members: FamilyMember[]; onUpdate: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Familiares</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Implementación similar a Contratos y Salud</p>
      </CardContent>
    </Card>
  )
}

// Requests Tab
function RequestsTab({
  employeeId,
  requests,
  onUpdate,
}: { employeeId: number; requests: Request[]; onUpdate: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Implementación similar a Contratos y Salud</p>
      </CardContent>
    </Card>
  )
}
