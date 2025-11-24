"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createEmployee, updateEmployee, getEmployee } from "@/lib/employees-api"
import { getCompanies } from "@/lib/companies-api"
import type { EmployeeCreateRequest } from "@/types/employee"
import type { Company } from "@/types/organizational-structure"

interface MultiStepEmployeeFormProps {
  employeeId?: number
}

export function MultiStepEmployeeForm({ employeeId }: MultiStepEmployeeFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(employeeId ? 2 : 1)
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])

  // Form data
  const [formData, setFormData] = useState<EmployeeCreateRequest>({
    firstName: "",
    lastName: "",
    email: "",
    positionId: 0,
    documentType: "",
    documentNumber: "",
    cuil: "",
    birthDate: "",
    nationality: "",
    gender: "",
    civilStatus: "",
    phone: "",
    address: "",
    addressNumber: "",
    addressFloor: "",
    addressApartment: "",
    addressPostalCode: "",
    addressCity: "",
    addressProvince: "",
  })

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null)

  useEffect(() => {
    loadCompanies()
    if (employeeId) {
      loadEmployee()
    }
  }, [employeeId])

  const loadCompanies = async () => {
    try {
      const response = await getCompanies({ pageSize: 100 })
      setCompanies(response.data.results)
    } catch (error) {
      console.error("[v0] Failed to load companies:", error)
    }
  }

  const loadEmployee = async () => {
    if (!employeeId) return
    try {
      setLoading(true)
      const response = await getEmployee(employeeId)
      const employee = response.data

      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        positionId: employee.position.id,
        documentType: employee.documentType || "",
        documentNumber: employee.documentNumber || "",
        cuil: employee.cuil || "",
        birthDate: employee.birthDate || "",
        nationality: employee.nationality || "",
        gender: employee.gender || "",
        civilStatus: employee.civilStatus || "",
        phone: employee.phone || "",
        address: employee.address || "",
        addressNumber: employee.addressNumber || "",
        addressFloor: employee.addressFloor || "",
        addressApartment: employee.addressApartment || "",
        addressPostalCode: employee.addressPostalCode || "",
        addressCity: employee.addressCity || "",
        addressProvince: employee.addressProvince || "",
      })

      // Set hierarchy selection
      setSelectedCompanyId(employee.position.department.area.company.id)
      setSelectedAreaId(employee.position.department.area.id)
      setSelectedDepartmentId(employee.position.department.id)
    } catch (error) {
      console.error("[v0] Failed to load employee:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if (employeeId) {
        await updateEmployee(employeeId, formData)
      } else {
        await createEmployee(formData)
      }
      router.push("/dashboard/employees")
    } catch (error) {
      console.error("[v0] Failed to save employee:", error)
      alert("Error al guardar el empleado")
    } finally {
      setLoading(false)
    }
  }

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId)
  const selectedArea = selectedCompany?.areas.find((a) => a.id === selectedAreaId)
  const selectedDepartment = selectedArea?.departments.find((d) => d.id === selectedDepartmentId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{employeeId ? "Editar Empleado" : "Crear Empleado"}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/employees")}>
            Cancelar
          </Button>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 1: Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value) => setFormData({ ...formData, documentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DNI">DNI</SelectItem>
                    <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                    <SelectItem value="Cédula">Cédula</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Número de Documento</Label>
                <Input
                  id="documentNumber"
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cuil">CUIL</Label>
                <Input
                  id="cuil"
                  value={formData.cuil}
                  onChange={(e) => setFormData({ ...formData, cuil: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nacionalidad</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="civilStatus">Estado Civil</Label>
                <Select
                  value={formData.civilStatus}
                  onValueChange={(value) => setFormData({ ...formData, civilStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Soltero">Soltero</SelectItem>
                    <SelectItem value="Casado">Casado</SelectItem>
                    <SelectItem value="Divorciado">Divorciado</SelectItem>
                    <SelectItem value="Viudo">Viudo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.firstName || !formData.lastName || !formData.email}
              >
                Siguiente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Address */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 2: Dirección</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Calle</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressNumber">Número</Label>
                <Input
                  id="addressNumber"
                  value={formData.addressNumber}
                  onChange={(e) => setFormData({ ...formData, addressNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressFloor">Piso</Label>
                <Input
                  id="addressFloor"
                  value={formData.addressFloor}
                  onChange={(e) => setFormData({ ...formData, addressFloor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressApartment">Departamento</Label>
                <Input
                  id="addressApartment"
                  value={formData.addressApartment}
                  onChange={(e) => setFormData({ ...formData, addressApartment: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressPostalCode">Código Postal</Label>
                <Input
                  id="addressPostalCode"
                  value={formData.addressPostalCode}
                  onChange={(e) => setFormData({ ...formData, addressPostalCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressCity">Ciudad</Label>
                <Input
                  id="addressCity"
                  value={formData.addressCity}
                  onChange={(e) => setFormData({ ...formData, addressCity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressProvince">Provincia</Label>
                <Input
                  id="addressProvince"
                  value={formData.addressProvince}
                  onChange={(e) => setFormData({ ...formData, addressProvince: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Atrás
              </Button>
              <Button onClick={() => setStep(3)}>Siguiente</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Position Assignment */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Paso 3: Asignación de Puesto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Empresa *</Label>
                <Select
                  value={selectedCompanyId?.toString()}
                  onValueChange={(value) => {
                    setSelectedCompanyId(Number(value))
                    setSelectedAreaId(null)
                    setSelectedDepartmentId(null)
                    setFormData({ ...formData, positionId: 0 })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCompany && (
                <div className="space-y-2">
                  <Label>Área *</Label>
                  <Select
                    value={selectedAreaId?.toString()}
                    onValueChange={(value) => {
                      setSelectedAreaId(Number(value))
                      setSelectedDepartmentId(null)
                      setFormData({ ...formData, positionId: 0 })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar área" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCompany.areas.map((area) => (
                        <SelectItem key={area.id} value={area.id.toString()}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedArea && (
                <div className="space-y-2">
                  <Label>Departamento *</Label>
                  <Select
                    value={selectedDepartmentId?.toString()}
                    onValueChange={(value) => {
                      setSelectedDepartmentId(Number(value))
                      setFormData({ ...formData, positionId: 0 })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedArea.departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedDepartment && (
                <div className="space-y-2">
                  <Label>Puesto *</Label>
                  <Select
                    value={formData.positionId.toString()}
                    onValueChange={(value) => setFormData({ ...formData, positionId: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar puesto" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDepartment.positions.map((position) => (
                        <SelectItem key={position.id} value={position.id.toString()}>
                          {position.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Atrás
              </Button>
              <Button onClick={handleSubmit} disabled={loading || !formData.positionId}>
                {loading ? "Guardando..." : employeeId ? "Actualizar" : "Crear Empleado"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
