"use client"

import { CardFooter } from "@/components/ui/card"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CompaniesAPI } from "@/lib/companies-api"
import { AreasAPI } from "@/lib/areas-api"
import { DepartmentsAPI } from "@/lib/departments-api"
import { PositionsAPI } from "@/lib/positions-api"
import { toast } from "sonner"
import { IconCheck, IconPlus, IconTrash, IconEdit, IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Company } from "@/types/organizational-structure"

interface AreaData {
  id?: number
  tempId: string
  name: string
  description: string
  departments: DepartmentData[]
  employeeCount?: number
}

interface DepartmentData {
  id?: number
  tempId: string
  name: string
  description: string
  positions: PositionData[]
  employeeCount?: number
}

interface PositionData {
  id?: number
  tempId: string
  name: string
  description: string
  employeeCount?: number
}

interface CompanyData {
  id?: number
  name: string
  address: string
  email: string
  phone: string
  industry: string
}

const STEPS = [
  {
    id: 1,
    title: "Información de la Empresa",
    description: "Datos básicos de la empresa",
  },
  { id: 2, title: "Áreas", description: "Define las áreas de la empresa" },
  {
    id: 3,
    title: "Departamentos",
    description: "Agrega departamentos a cada área",
  },
  {
    id: 4,
    title: "Puestos",
    description: "Define los puestos de cada departamento",
  },
  { id: 5, title: "Revisión", description: "Revisa y confirma la información" },
]

export function MultiStepCompanyForm({ companyId }: { companyId?: number }) {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(companyId ? 2 : 1)
  const [loading, setLoading] = useState(false)
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companyId ? companyId.toString() : "")
  const [isEditMode, setIsEditMode] = useState(!!companyId)

  // Edit Dialog States
  const [editingItem, setEditingItem] = useState<{
    type: "area" | "department" | "position"
    id: number
    tempId: string
    name: string
    description: string
  } | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Step 1: Company data
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    address: "",
    email: "",
    phone: "",
    industry: "",
  })

  // Step 2: Areas
  const [areas, setAreas] = useState<AreaData[]>([])
  const [newArea, setNewArea] = useState({ name: "", description: "" })

  // Step 3: Departments (selected area)
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
  })

  // Step 4: Positions (selected department)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null)
  const [newPosition, setNewPosition] = useState({ name: "", description: "" })

  const progress = (currentStep / STEPS.length) * 100

  useEffect(() => {
    if (companyId) {
      const loadCompany = async () => {
        setLoading(true)
        try {
          const res = await CompaniesAPI.getCompanyById(companyId)
          const company = res.data

          if (company) {
            setCompanyData({
              id: company.id,
              name: company.name,
              address: company.address,
              email: company.email,
              phone: company.phone,
              industry: company.industry || "",
            })

            const mappedAreas: AreaData[] = (company.areas || []).map((area) => ({
              id: area.id,
              tempId: `area-${area.id}`,
              name: area.name,
              description: "",
              employeeCount: area.employeeCount, // Map employee count
              departments: (area.departments || []).map((dept) => ({
                id: dept.id,
                tempId: `dept-${dept.id}`,
                name: dept.name,
                description: "",
                employeeCount: dept.employeeCount, // Map employee count
                positions: (dept.positions || []).map((pos) => ({
                  id: pos.id,
                  tempId: `pos-${pos.id}`,
                  name: pos.name,
                  description: "",
                  employeeCount: pos.employeeCount, // Map employee count
                })),
              })),
            }))

            setAreas(mappedAreas)
            // If editing, we can start directly at Areas step (2) or stay there
            setCurrentStep(2)
          }
        } catch (error) {
          console.error("Error loading company details:", error)
          toast.error("Error al cargar detalles de la empresa")
        } finally {
          setLoading(false)
        }
      }
      loadCompany()
    }
  }, [companyId])

  useEffect(() => {
    if (!companyId) {
      const fetchCompanies = async () => {
        try {
          const response = await CompaniesAPI.getCompanies({ pageSize: 50 })
          setAvailableCompanies(response.data.results)
        } catch (error) {
          console.error("Failed to load companies", error)
        }
      }
      fetchCompanies()
    }
  }, [companyId])

  // Handle Company Selection
  const handleCompanySelect = async (companyId: string) => {
    if (companyId === "new") {
      setIsEditMode(false)
      setSelectedCompanyId("")
      setCompanyData({
        name: "",
        address: "",
        email: "",
        phone: "",
        industry: "",
      })
      setAreas([])
      setCurrentStep(1)
      return
    }

    setSelectedCompanyId(companyId)
    setIsEditMode(true)
    setLoading(true)

    try {
      let company = availableCompanies.find((c) => c.id.toString() === companyId)
      if (!company || !company.areas) {
        const res = await CompaniesAPI.getCompanyById(Number.parseInt(companyId))
        company = res.data
      }

      if (company) {
        setCompanyData({
          id: company.id,
          name: company.name,
          address: company.address,
          email: company.email,
          phone: company.phone,
          industry: company.industry || "",
        })

        const mappedAreas: AreaData[] = (company.areas || []).map((area) => ({
          id: area.id,
          tempId: `area-${area.id}`,
          name: area.name,
          description: "", // Description might be missing in some types
          departments: (area.departments || []).map((dept) => ({
            id: dept.id,
            tempId: `dept-${dept.id}`,
            name: dept.name,
            description: "",
            positions: (dept.positions || []).map((pos) => ({
              id: pos.id,
              tempId: `pos-${pos.id}`,
              name: pos.name,
              description: "",
            })),
          })),
        }))

        setAreas(mappedAreas)
        setCurrentStep(1)
        toast.success("Estructura de empresa cargada")
      }
    } catch (error) {
      console.error("Error loading company details:", error)
      toast.error("Error al cargar detalles de la empresa")
    } finally {
      setLoading(false)
    }
  }

  //added navigation handler
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/companies")
  }

  // Step 1 handlers
  const handleCompanyNext = async () => {
    if (
      !companyData.name ||
      !companyData.address ||
      !companyData.email ||
      !companyData.phone ||
      !companyData.industry
    ) {
      toast.error("Por favor completa todos los campos")
      return
    }

    if (isEditMode && companyData.id) {
      try {
        await CompaniesAPI.updateCompany(companyData.id, {
          name: companyData.name,
          address: companyData.address,
          email: companyData.email,
          phone: companyData.phone,
          industry: companyData.industry,
        })
        toast.success("Empresa actualizada")
      } catch (error) {
        toast.error("Error al actualizar empresa")
        return
      }
    }

    setCurrentStep(2)
  }

  // Step 2 handlers
  const handleAddArea = async () => {
    if (!newArea.name || !newArea.description) {
      toast.error("Por favor completa todos los campos del área")
      return
    }

    if (isEditMode && companyData.id) {
      try {
        const res = await AreasAPI.createArea({
          name: newArea.name,
          description: newArea.description,
          companyId: companyData.id,
        })

        setAreas([
          ...areas,
          {
            id: res.data.id,
            tempId: `area-${res.data.id}`,
            name: res.data.name,
            description: res.data.description,
            departments: [],
            employeeCount: 0, // Initialize employee count
          },
        ])
        setNewArea({ name: "", description: "" })
        toast.success("Área creada exitosamente")
      } catch (error) {
        toast.error("Error al crear área")
      }
    } else {
      setAreas([
        ...areas,
        {
          tempId: `area-${Date.now()}`,
          name: newArea.name,
          description: newArea.description,
          departments: [],
          employeeCount: 0, // Initialize employee count
        },
      ])
      setNewArea({ name: "", description: "" })
      toast.success("Área agregada")
    }
  }

  const handleRemoveArea = async (area: AreaData) => {
    if (isEditMode && area.id) {
      if (!confirm("¿Estás seguro de eliminar esta área y todo su contenido?")) return
      try {
        await AreasAPI.deleteArea(area.id)
        setAreas(areas.filter((a) => a.tempId !== area.tempId))
        toast.success("Área eliminada")
      } catch (error) {
        toast.error("Error al eliminar área")
      }
    } else {
      setAreas(areas.filter((a) => a.tempId !== area.tempId))
      toast.success("Área eliminada")
    }
  }

  const openEditArea = (area: AreaData) => {
    setEditingItem({
      type: "area",
      id: area.id || 0,
      tempId: area.tempId,
      name: area.name,
      description: area.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleAreasNext = () => {
    if (areas.length === 0) {
      toast.error("Debes agregar al menos un área")
      return
    }
    setCurrentStep(3)
  }

  // Step 3 handlers
  const handleAddDepartment = async () => {
    if (!selectedAreaId) {
      toast.error("Selecciona un área primero")
      return
    }
    if (!newDepartment.name || !newDepartment.description) {
      toast.error("Por favor completa todos los campos del departamento")
      return
    }

    const currentArea = areas.find((a) => a.tempId === selectedAreaId)

    if (isEditMode && currentArea?.id) {
      try {
        const res = await DepartmentsAPI.createDepartment({
          name: newDepartment.name,
          description: newDepartment.description,
          areaId: currentArea.id,
        })

        setAreas(
          areas.map((area) =>
            area.tempId === selectedAreaId
              ? {
                  ...area,
                  departments: [
                    ...area.departments,
                    {
                      id: res.data.id,
                      tempId: `dept-${res.data.id}`,
                      name: res.data.name,
                      description: res.data.description,
                      positions: [],
                      employeeCount: 0, // Initialize employee count
                    },
                  ],
                }
              : area,
          ),
        )
        setNewDepartment({ name: "", description: "" })
        toast.success("Departamento creado")
      } catch (error) {
        toast.error("Error al crear departamento")
      }
    } else {
      setAreas(
        areas.map((area) =>
          area.tempId === selectedAreaId
            ? {
                ...area,
                departments: [
                  ...area.departments,
                  {
                    tempId: `dept-${Date.now()}`,
                    name: newDepartment.name,
                    description: newDepartment.description,
                    positions: [],
                    employeeCount: 0, // Initialize employee count
                  },
                ],
              }
            : area,
        ),
      )
      setNewDepartment({ name: "", description: "" })
      toast.success("Departamento agregado")
    }
  }

  const handleRemoveDepartment = async (areaId: string, dept: DepartmentData) => {
    if (isEditMode && dept.id) {
      if (!confirm("¿Eliminar este departamento?")) return
      try {
        await DepartmentsAPI.deleteDepartment(dept.id)
        setAreas(
          areas.map((area) =>
            area.tempId === areaId
              ? {
                  ...area,
                  departments: area.departments.filter((d) => d.tempId !== dept.tempId),
                }
              : area,
          ),
        )
        toast.success("Departamento eliminado")
      } catch (e) {
        console.error(e)
        toast.error("Error al eliminar departamento")
      }
    } else {
      setAreas(
        areas.map((area) =>
          area.tempId === areaId
            ? {
                ...area,
                departments: area.departments.filter((d) => d.tempId !== dept.tempId),
              }
            : area,
        ),
      )
      toast.success("Departamento eliminado")
    }
  }

  const openEditDepartment = (dept: DepartmentData) => {
    setEditingItem({
      type: "department",
      id: dept.id || 0,
      tempId: dept.tempId,
      name: dept.name,
      description: dept.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleDepartmentsNext = () => {
    const totalDepartments = areas.reduce((sum, area) => sum + area.departments.length, 0)
    if (totalDepartments === 0) {
      toast.error("Debes agregar al menos un departamento")
      return
    }
    setCurrentStep(4)
  }

  // Step 4 handlers
  const handleAddPosition = async () => {
    if (!selectedAreaId || !selectedDepartmentId) {
      toast.error("Selecciona un área y departamento primero")
      return
    }
    if (!newPosition.name || !newPosition.description) {
      toast.error("Por favor completa todos los campos del puesto")
      return
    }

    const currentArea = areas.find((a) => a.tempId === selectedAreaId)
    const currentDept = currentArea?.departments.find((d) => d.tempId === selectedDepartmentId)

    if (isEditMode && currentDept?.id) {
      try {
        const res = await PositionsAPI.createPosition({
          name: newPosition.name,
          description: newPosition.description,
          departmentId: currentDept.id,
        })

        setAreas(
          areas.map((area) =>
            area.tempId === selectedAreaId
              ? {
                  ...area,
                  departments: area.departments.map((dept) =>
                    dept.tempId === selectedDepartmentId
                      ? {
                          ...dept,
                          positions: [
                            ...dept.positions,
                            {
                              id: res.data.id,
                              tempId: `pos-${res.data.id}`,
                              name: res.data.name,
                              description: res.data.description,
                              employeeCount: 0, // Initialize employee count
                            },
                          ],
                        }
                      : dept,
                  ),
                }
              : area,
          ),
        )
        setNewPosition({ name: "", description: "" })
        toast.success("Puesto creado")
      } catch (error) {
        toast.error("Error al crear puesto")
      }
    } else {
      setAreas(
        areas.map((area) =>
          area.tempId === selectedAreaId
            ? {
                ...area,
                departments: area.departments.map((dept) =>
                  dept.tempId === selectedDepartmentId
                    ? {
                        ...dept,
                        positions: [
                          ...dept.positions,
                          {
                            tempId: `pos-${Date.now()}`,
                            name: newPosition.name,
                            description: newPosition.description,
                            employeeCount: 0, // Initialize employee count
                          },
                        ],
                      }
                    : dept,
                ),
              }
            : area,
        ),
      )
      setNewPosition({ name: "", description: "" })
      toast.success("Puesto agregado")
    }
  }

  const openEditPosition = (pos: PositionData) => {
    setEditingItem({
      type: "position",
      id: pos.id || 0,
      tempId: pos.tempId,
      name: pos.name,
      description: pos.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleRemovePosition = async (areaId: string, deptId: string, pos: PositionData) => {
    if (isEditMode && pos.id) {
      if (!confirm("¿Eliminar este puesto?")) return
      try {
        await PositionsAPI.deletePosition(pos.id)
        setAreas(
          areas.map((area) =>
            area.tempId === areaId
              ? {
                  ...area,
                  departments: area.departments.map((dept) =>
                    dept.tempId === deptId
                      ? {
                          ...dept,
                          positions: dept.positions.filter((p) => p.tempId !== pos.tempId),
                        }
                      : dept,
                  ),
                }
              : area,
          ),
        )
        toast.success("Puesto eliminado")
      } catch (e) {
        console.error(e)
        toast.error("Error al eliminar puesto")
      }
    } else {
      setAreas(
        areas.map((area) =>
          area.tempId === areaId
            ? {
                ...area,
                departments: area.departments.map((dept) =>
                  dept.tempId === deptId
                    ? {
                        ...dept,
                        positions: dept.positions.filter((p) => p.tempId !== pos.tempId),
                      }
                    : dept,
                ),
              }
            : area,
        ),
      )
      toast.success("Puesto eliminado")
    }
  }

  const handlePositionsNext = () => {
    const totalPositions = areas.reduce(
      (sum, area) => sum + area.departments.reduce((dSum, dept) => dSum + dept.positions.length, 0),
      0,
    )
    if (totalPositions === 0) {
      toast.error("Debes agregar al menos un puesto")
      return
    }
    setCurrentStep(5)
  }

  // Step 5: Submit all data
  const handleSubmit = async () => {
    if (isEditMode) {
      toast.success("Cambios guardados correctamente")
      router.push("/dashboard/companies")
      return
    }
    setLoading(true)
    try {
      // 1. Create company
      const companyResponse = await CompaniesAPI.createCompany(companyData)
      const companyId = companyResponse.data.id

      // 2. Create areas and track IDs
      const areaIdMap = new Map<string, number>()
      for (const area of areas) {
        const areaResponse = await AreasAPI.createArea({
          name: area.name,
          description: area.description,
          companyId,
        })
        areaIdMap.set(area.tempId, areaResponse.data.id)
      }

      // 3. Create departments and track IDs
      const deptIdMap = new Map<string, number>()
      for (const area of areas) {
        const areaId = areaIdMap.get(area.tempId)!
        for (const dept of area.departments) {
          const deptResponse = await DepartmentsAPI.createDepartment({
            name: dept.name,
            description: dept.description,
            areaId,
          })
          deptIdMap.set(dept.tempId, deptResponse.data.id)
        }
      }

      // 4. Create positions
      for (const area of areas) {
        for (const dept of area.departments) {
          const deptId = deptIdMap.get(dept.tempId)!
          for (const pos of dept.positions) {
            await PositionsAPI.createPosition({
              name: pos.name,
              description: pos.description,
              departmentId: deptId,
            })
          }
        }
      }

      toast.success("Empresa y estructura organizacional creada exitosamente")
      router.push("/dashboard/companies")
    } catch (error) {
      console.error("Error creating company structure:", error)
      toast.error("Error al crear la estructura organizacional")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return

    try {
      if (editingItem.type === "area") {
        await AreasAPI.updateArea(editingItem.id, {
          name: editingItem.name,
          description: editingItem.description, // Added description update
        })

        setAreas(
          areas.map((a) =>
            a.tempId === editingItem.tempId
              ? { ...a, name: editingItem.name, description: editingItem.description }
              : a,
          ),
        )
      } else if (editingItem.type === "department") {
        await DepartmentsAPI.updateDepartment(editingItem.id, {
          name: editingItem.name,
          description: editingItem.description, // Added description update
        })

        setAreas(
          areas.map((a) => ({
            ...a,
            departments: a.departments.map((d) =>
              d.tempId === editingItem.tempId
                ? { ...d, name: editingItem.name, description: editingItem.description }
                : d,
            ),
          })),
        )
      } else if (editingItem.type === "position") {
        await PositionsAPI.updatePosition(editingItem.id, {
          name: editingItem.name,
          description: editingItem.description, // Added description update
        })

        setAreas(
          areas.map((a) => ({
            ...a,
            departments: a.departments.map((d) => ({
              ...d,
              positions: d.positions.map((p) =>
                p.tempId === editingItem.tempId
                  ? { ...p, name: editingItem.name, description: editingItem.description }
                  : p,
              ),
            })),
          })),
        )
      }
      toast.success("Actualizado correctamente")
      setIsEditDialogOpen(false)
      setEditingItem(null)
    } catch (error) {
      console.error(error)
      toast.error("Error al actualizar")
    }
  }

  // If companyId is passed, we skip step 1 in UI or just show current step
  const renderStep1 = () => {
    // If we are in "Edit Mode" via companyId prop, we might want to skip showing this selection screen entirely
    // or just show the form to edit basic info.
    // However, the prompt asked to "ocultar dropdown de empresa" when clicking edit.
    // If companyId is present, we are already "selected", so we just show the edit form for basic info IF step is 1.
    // But we initialized step to 2 if companyId is present.
    // If user goes back to step 1, they should see the form, not the selector.

    return (
      <Card>
        <CardHeader>
          <CardTitle>Información de la Empresa</CardTitle>
          <CardDescription>
            {isEditMode ? "Edita los datos básicos de la empresa" : "Ingresa los datos de la nueva empresa"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!companyId && (
            <div className="space-y-2">
              <Label>Seleccionar Empresa Existente (o crear nueva)</Label>
              <Select value={selectedCompanyId} onValueChange={(val) => handleCompanySelect(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empresa..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">-- Crear Nueva Empresa --</SelectItem>
                  {availableCompanies.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nombre de la Empresa</Label>
              <Input
                id="company-name"
                value={companyData.name}
                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                placeholder="Ej: TechCorp S.A."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Email</Label>
              <Input
                id="company-email"
                value={companyData.email}
                onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                placeholder="Ej: contact@techcorp.com"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">Teléfono</Label>
              <Input
                id="company-phone"
                value={companyData.phone}
                onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                placeholder="Ej: +54 9 11 1234-5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-industry">Industria</Label>
              <Input
                id="company-industry"
                value={companyData.industry}
                onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                placeholder="Ej: Tecnología"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address">Dirección</Label>
              <Textarea
                id="company-address"
                value={companyData.address}
                onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                placeholder="Ej: Av. Principal 123, Ciudad"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end gap-2 w-full">
            <Button onClick={handleCompanyNext}>{isEditMode ? "Guardar y Continuar" : "Siguiente"}</Button>
          </div>
        </CardFooter>
      </Card>
    )
  }

  const renderStep2 = () => (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Áreas de la Empresa</CardTitle>
          <CardDescription>Define las áreas principales de tu empresa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {areas.map((area) => (
              <div
                key={area.tempId}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedAreaId === area.tempId ? "bg-primary/10 border-primary" : "hover:bg-muted"
                }`}
                onClick={() => setSelectedAreaId(area.tempId)}
              >
                <div>
                  <div className="font-medium">{area.name}</div>
                  <div className="text-sm text-muted-foreground">{area.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{area.employeeCount || 0} Empleados</div>
                </div>
                <div className="flex items-center gap-1">
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditArea(area)
                      }}
                    >
                      <IconEdit className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveArea(area)
                    }}
                  >
                    <IconTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {areas.length === 0 && <div className="text-center py-8 text-muted-foreground">No hay áreas agregadas</div>}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Nueva Área</CardTitle>
          <CardDescription>Agrega una nueva área a la empresa.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="area-name">Nombre del Área</Label>
            <Input
              id="area-name"
              value={newArea.name}
              onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
              placeholder="Ej: Recursos Humanos"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area-description">Descripción</Label>
            <Textarea
              id="area-description"
              value={newArea.description}
              onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
              placeholder="Ej: Área encargada de la gestión del personal"
              rows={2}
            />
          </div>
          <Button onClick={handleAddArea} variant="outline" className="w-full bg-transparent">
            <IconPlus className="w-4 h-4 mr-2" />
            {isEditMode ? "Crear Nueva Área" : "Agregar Área"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep3 = () => (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Áreas de la Empresa</CardTitle>
          <CardDescription>Selecciona un área para agregar o ver sus departamentos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {areas.map((area) => (
              <div
                key={area.tempId}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedAreaId === area.tempId ? "bg-primary/10 border-primary" : "hover:bg-muted"
                }`}
                onClick={() => setSelectedAreaId(area.tempId)}
              >
                <div>
                  <div className="font-medium">{area.name}</div>
                  <div className="text-sm text-muted-foreground">{area.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{area.employeeCount || 0} Empleados</div>
                </div>
                {/* No edit/delete buttons for areas here, they are in Step 2 */}
              </div>
            ))}
            {areas.length === 0 && <div className="text-center py-8 text-muted-foreground">No hay áreas agregadas</div>}
          </div>
        </CardContent>
      </Card>
      {selectedAreaId ? (
        <Card>
          <CardHeader>
            <CardTitle>Departamentos de {areas.find((a) => a.tempId === selectedAreaId)?.name}</CardTitle>
            <CardDescription>Agrega o gestiona los departamentos de esta área.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dept-name">Nombre del Departamento</Label>
                <Input
                  id="dept-name"
                  value={newDepartment.name}
                  onChange={(e) =>
                    setNewDepartment({
                      ...newDepartment,
                      name: e.target.value,
                    })
                  }
                  placeholder="Ej: Reclutamiento"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dept-description">Descripción</Label>
                <Textarea
                  id="dept-description"
                  value={newDepartment.description}
                  onChange={(e) =>
                    setNewDepartment({
                      ...newDepartment,
                      description: e.target.value,
                    })
                  }
                  placeholder="Ej: Departamento encargado del proceso de reclutamiento"
                  rows={2}
                />
              </div>
              <Button onClick={handleAddDepartment} variant="outline" className="w-full bg-transparent">
                <IconPlus className="w-4 h-4 mr-2" />
                {isEditMode ? "Crear Nuevo Departamento" : "Agregar Departamento"}
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t mt-4">
              <Label>
                Departamentos agregados ({areas.find((a) => a.tempId === selectedAreaId)?.departments.length || 0})
              </Label>
              <div className="space-y-2">
                {areas
                  .find((a) => a.tempId === selectedAreaId)
                  ?.departments.map((dept) => (
                    <div
                      key={dept.tempId}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDepartmentId === dept.tempId ? "bg-primary/10 border-primary" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedDepartmentId(dept.tempId)}
                    >
                      <div>
                        <div className="font-medium">{dept.name}</div>
                        <div className="text-sm text-muted-foreground">{dept.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">{dept.employeeCount || 0} Empleados</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {isEditMode && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditDepartment(dept)
                            }}
                          >
                            <IconEdit className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveDepartment(selectedAreaId!, dept)
                          }}
                        >
                          <IconTrash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                {areas.find((a) => a.tempId === selectedAreaId)?.departments.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">No hay departamentos en esta área</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground border rounded-lg p-8 bg-muted/50">
          Selecciona un área para gestionar sus departamentos
        </div>
      )}
    </div>
  )

  const renderStep4 = () => (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Departamentos</CardTitle>
          <CardDescription>Selecciona un departamento para agregar o ver sus puestos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {areas
              .find((a) => a.tempId === selectedAreaId)
              ?.departments.map((dept) => (
                <div
                  key={dept.tempId}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedDepartmentId === dept.tempId ? "bg-primary/10 border-primary" : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedDepartmentId(dept.tempId)}
                >
                  <div>
                    <div className="font-medium">{dept.name}</div>
                    <div className="text-sm text-muted-foreground">{dept.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">{dept.employeeCount || 0} Empleados</div>
                  </div>
                  {/* No edit/delete buttons for departments here, they are in Step 3 */}
                </div>
              ))}
            {areas.find((a) => a.tempId === selectedAreaId)?.departments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No hay departamentos en esta área</div>
            )}
          </div>
        </CardContent>
      </Card>
      {selectedDepartmentId ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Puestos de{" "}
              {
                areas
                  .find((a) => a.tempId === selectedAreaId)
                  ?.departments.find((d) => d.tempId === selectedDepartmentId)?.name
              }
            </CardTitle>
            <CardDescription>Agrega o gestiona los puestos de este departamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pos-name">Nombre del Puesto</Label>
                <Input
                  id="pos-name"
                  value={newPosition.name}
                  onChange={(e) =>
                    setNewPosition({
                      ...newPosition,
                      name: e.target.value,
                    })
                  }
                  placeholder="Ej: Analista Senior"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pos-description">Descripción</Label>
                <Textarea
                  id="pos-description"
                  value={newPosition.description}
                  onChange={(e) =>
                    setNewPosition({
                      ...newPosition,
                      description: e.target.value,
                    })
                  }
                  placeholder="Ej: Responsable de análisis de datos"
                  rows={2}
                />
              </div>
              <Button onClick={handleAddPosition} variant="outline" className="w-full bg-transparent">
                <IconPlus className="w-4 h-4 mr-2" />
                {isEditMode ? "Crear Nuevo Puesto" : "Agregar Puesto"}
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t mt-4">
              <Label>
                Puestos agregados (
                {areas
                  .find((a) => a.tempId === selectedAreaId)
                  ?.departments.find((d) => d.tempId === selectedDepartmentId)?.positions.length || 0}
                )
              </Label>
              <div className="space-y-2">
                {areas
                  .find((a) => a.tempId === selectedAreaId)
                  ?.departments.find((d) => d.tempId === selectedDepartmentId)
                  ?.positions.map((pos) => (
                    <div key={pos.tempId} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div>
                        <div className="font-medium">{pos.name}</div>
                        <div className="text-sm text-muted-foreground">{pos.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">{pos.employeeCount || 0} Empleados</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {isEditMode && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditPosition(pos)
                            }}
                          >
                            <IconEdit className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemovePosition(selectedAreaId!, selectedDepartmentId!, pos)
                          }}
                        >
                          <IconTrash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                {areas
                  .find((a) => a.tempId === selectedAreaId)
                  ?.departments.find((d) => d.tempId === selectedDepartmentId)?.positions.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">No hay puestos en este departamento</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground border rounded-lg p-8 bg-muted/50">
          Selecciona un departamento para gestionar sus puestos
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Removed standalone selector, integrated into renderStep1 */}
      {(selectedCompanyId || currentStep > 0 || companyId) && (
        <>
          <div className="relative">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  Paso {currentStep} de {STEPS.length}
                </span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-between mt-4">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-4 ${
                      currentStep > step.id
                        ? "bg-primary border-primary text-primary-foreground shadow-2xl"
                        : currentStep === step.id
                          ? "border-primary text-primary shadow-2xl"
                          : "border-muted text-muted-foreground shadow-2xl"
                    }`}
                  >
                    {currentStep > step.id ? <IconCheck className="w-5 h-5 shadow-2xl" /> : step.id}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-8 h-1 sm:w-32 shadow-2xl mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {/* Step 1: Company Info */}
            {currentStep === 1 && renderStep1()}

            {/* Step 2: Areas */}
            {currentStep === 2 && renderStep2()}

            {/* Step 3: Departments */}
            {currentStep === 3 && renderStep3()}

            {/* Step 4: Positions */}
            {currentStep === 4 && renderStep4()}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Estructura</CardTitle>
                  <CardDescription>Revisa la estructura creada antes de finalizar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">Empresa</div>
                        <div className="font-medium text-lg">{companyData.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Áreas</div>
                        <div className="font-medium text-lg">{areas.length}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {areas.map((area) => (
                        <div key={area.tempId} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            {area.name}
                            <Badge variant="secondary" className="text-xs">
                              {area.departments.length} Deptos
                            </Badge>
                          </h4>
                          <div className="pl-4 border-l-2 border-muted space-y-3">
                            {area.departments.map((dept) => (
                              <div key={dept.tempId}>
                                <div className="text-sm font-medium flex items-center gap-2">
                                  {dept.name}
                                  <span className="text-muted-foreground text-xs">
                                    ({dept.positions.length} puestos)
                                  </span>
                                </div>
                                <div className="pl-2 mt-1 flex flex-wrap gap-1">
                                  {dept.positions.map((pos) => (
                                    <Badge key={pos.tempId} variant="outline" className="text-xs font-normal">
                                      {pos.name}
                                    </Badge>
                                  ))}
                                  {dept.positions.length === 0 && (
                                    <span className="text-xs text-muted-foreground italic">Sin puestos</span>
                                  )}
                                </div>
                              </div>
                            ))}
                            {area.departments.length === 0 && (
                              <span className="text-sm text-muted-foreground italic">Sin departamentos</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <IconArrowLeft className="mr-2 h-4 w-4" />
                    Atrás
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Guardando..." : isEditMode ? "Finalizar Edición" : "Confirmar y Crear Empresa"}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Editar{" "}
              {editingItem?.type === "area" ? "Área" : editingItem?.type === "department" ? "Departamento" : "Puesto"}
            </DialogTitle>
            <DialogDescription>Modifica los detalles del elemento seleccionado.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={editingItem?.name || ""}
                onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, name: e.target.value } : null))}
              />
            </div>
            {editingItem?.type !== "position" && (
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  value={editingItem?.description || ""}
                  onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation buttons at the bottom */}
      {currentStep > 1 && currentStep < 5 && (
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-2 bg-transparent">
            <IconArrowLeft className="h-4 w-4" />
            Atrás
          </Button>
          <Button
            onClick={() => {
              // This logic needs to be adapted based on the current step's "next" action
              if (currentStep === 1) handleCompanyNext()
              else if (currentStep === 2) handleAreasNext()
              else if (currentStep === 3) handleDepartmentsNext()
              else if (currentStep === 4) handlePositionsNext()
            }}
            className="flex items-center gap-2"
          >
            Siguiente
            <IconArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Bottom cancel button */}
      <div className="flex justify-start pt-4 border-t">
        <Button variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
