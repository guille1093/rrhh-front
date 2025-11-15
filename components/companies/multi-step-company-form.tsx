"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CompaniesAPI } from "@/lib/companies-api";
import { AreasAPI } from "@/lib/areas-api";
import { DepartmentsAPI } from "@/lib/departments-api";
import { PositionsAPI } from "@/lib/positions-api";
import { toast } from "sonner";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface AreaData {
  tempId: string;
  name: string;
  description: string;
  departments: DepartmentData[];
}

interface DepartmentData {
  tempId: string;
  name: string;
  description: string;
  positions: PositionData[];
}

interface PositionData {
  tempId: string;
  name: string;
  description: string;
}

interface CompanyData {
  name: string;
  address: string;
  email: string;
  phone: string;
  industry: string;
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
];

export function MultiStepCompanyForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Company data
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    address: "",
    email: "",
    phone: "",
    industry: "",
  });

  // Step 2: Areas
  const [areas, setAreas] = useState<AreaData[]>([]);
  const [newArea, setNewArea] = useState({ name: "", description: "" });

  // Step 3: Departments (selected area)
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
  });

  // Step 4: Positions (selected department)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [newPosition, setNewPosition] = useState({ name: "", description: "" });

  const progress = (currentStep / STEPS.length) * 100;

  // Step 1 handlers
  const handleCompanyNext = () => {
    if (
      !companyData.name ||
      !companyData.address ||
      !companyData.email ||
      !companyData.phone ||
      !companyData.industry
    ) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    setCurrentStep(2);
  };

  // Step 2 handlers
  const handleAddArea = () => {
    if (!newArea.name || !newArea.description) {
      toast.error("Por favor completa todos los campos del área");
      return;
    }
    setAreas([
      ...areas,
      {
        tempId: `area-${Date.now()}`,
        name: newArea.name,
        description: newArea.description,
        departments: [],
      },
    ]);
    setNewArea({ name: "", description: "" });
    toast.success("Área agregada");
  };

  const handleRemoveArea = (tempId: string) => {
    setAreas(areas.filter((a) => a.tempId !== tempId));
    toast.success("Área eliminada");
  };

  const handleAreasNext = () => {
    if (areas.length === 0) {
      toast.error("Debes agregar al menos un área");
      return;
    }
    setCurrentStep(3);
  };

  // Step 3 handlers
  const handleAddDepartment = () => {
    if (!selectedAreaId) {
      toast.error("Selecciona un área primero");
      return;
    }
    if (!newDepartment.name || !newDepartment.description) {
      toast.error("Por favor completa todos los campos del departamento");
      return;
    }

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
                },
              ],
            }
          : area,
      ),
    );
    setNewDepartment({ name: "", description: "" });
    toast.success("Departamento agregado");
  };

  const handleRemoveDepartment = (areaId: string, deptId: string) => {
    setAreas(
      areas.map((area) =>
        area.tempId === areaId
          ? {
              ...area,
              departments: area.departments.filter((d) => d.tempId !== deptId),
            }
          : area,
      ),
    );
    toast.success("Departamento eliminado");
  };

  const handleDepartmentsNext = () => {
    const totalDepartments = areas.reduce(
      (sum, area) => sum + area.departments.length,
      0,
    );
    if (totalDepartments === 0) {
      toast.error("Debes agregar al menos un departamento");
      return;
    }
    setCurrentStep(4);
  };

  // Step 4 handlers
  const handleAddPosition = () => {
    if (!selectedAreaId || !selectedDepartmentId) {
      toast.error("Selecciona un área y departamento primero");
      return;
    }
    if (!newPosition.name || !newPosition.description) {
      toast.error("Por favor completa todos los campos del puesto");
      return;
    }

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
                        },
                      ],
                    }
                  : dept,
              ),
            }
          : area,
      ),
    );
    setNewPosition({ name: "", description: "" });
    toast.success("Puesto agregado");
  };

  const handleRemovePosition = (
    areaId: string,
    deptId: string,
    posId: string,
  ) => {
    setAreas(
      areas.map((area) =>
        area.tempId === areaId
          ? {
              ...area,
              departments: area.departments.map((dept) =>
                dept.tempId === deptId
                  ? {
                      ...dept,
                      positions: dept.positions.filter(
                        (p) => p.tempId !== posId,
                      ),
                    }
                  : dept,
              ),
            }
          : area,
      ),
    );
    toast.success("Puesto eliminado");
  };

  const handlePositionsNext = () => {
    const totalPositions = areas.reduce(
      (sum, area) =>
        sum +
        area.departments.reduce(
          (dSum, dept) => dSum + dept.positions.length,
          0,
        ),
      0,
    );
    if (totalPositions === 0) {
      toast.error("Debes agregar al menos un puesto");
      return;
    }
    setCurrentStep(5);
  };

  // Step 5: Submit all data
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Create company
      const companyResponse = await CompaniesAPI.createCompany(companyData);
      const companyId = companyResponse.data.id;

      // 2. Create areas and track IDs
      const areaIdMap = new Map<string, number>();
      for (const area of areas) {
        const areaResponse = await AreasAPI.createArea({
          name: area.name,
          description: area.description,
          companyId,
        });
        areaIdMap.set(area.tempId, areaResponse.data.id);
      }

      // 3. Create departments and track IDs
      const deptIdMap = new Map<string, number>();
      for (const area of areas) {
        const areaId = areaIdMap.get(area.tempId)!;
        for (const dept of area.departments) {
          const deptResponse = await DepartmentsAPI.createDepartment({
            name: dept.name,
            description: dept.description,
            areaId,
          });
          deptIdMap.set(dept.tempId, deptResponse.data.id);
        }
      }

      // 4. Create positions
      for (const area of areas) {
        for (const dept of area.departments) {
          const deptId = deptIdMap.get(dept.tempId)!;
          for (const pos of dept.positions) {
            await PositionsAPI.createPosition({
              name: pos.name,
              description: pos.description,
              departmentId: deptId,
            });
          }
        }
      }

      toast.success("Empresa y estructura organizacional creada exitosamente");
      router.push("/dashboard/companies");
    } catch (error) {
      console.error("Error creating company structure:", error);
      toast.error("Error al crear la estructura organizacional");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
      <div className="flex items-center justify-between">
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
              {currentStep > step.id ? (
                <IconCheck className="w-5 h-5 shadow-2xl" />
              ) : (
                step.id
              )}
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-8 h-1 sm:w-32 shadow-2xl mx-2 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {STEPS[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Company Info */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="company-name">Nombre de la Empresa</Label>
                <Input
                  id="company-name"
                  value={companyData.name}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, name: e.target.value })
                  }
                  placeholder="Ej: TechCorp S.A."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Email</Label>
                <Input
                  id="company-email"
                  value={companyData.email}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, email: e.target.value })
                  }
                  placeholder="Ej: contact@techcorp.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-phone">Teléfono</Label>
                <Input
                  id="company-phone"
                  value={companyData.phone}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, phone: e.target.value })
                  }
                  placeholder="Ej: +54 9 11 1234-5678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-industry">Industria</Label>
                <Input
                  id="company-industry"
                  value={companyData.industry}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, industry: e.target.value })
                  }
                  placeholder="Ej: Tecnología"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Dirección</Label>
                <Textarea
                  id="company-address"
                  value={companyData.address}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, address: e.target.value })
                  }
                  placeholder="Ej: Av. Principal 123, Ciudad"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={handleCompanyNext}>Siguiente</Button>
              </div>
            </>
          )}

          {/* Step 2: Areas */}
          {currentStep === 2 && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="area-name">Nombre del Área</Label>
                  <Input
                    id="area-name"
                    value={newArea.name}
                    onChange={(e) =>
                      setNewArea({ ...newArea, name: e.target.value })
                    }
                    placeholder="Ej: Recursos Humanos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area-description">Descripción</Label>
                  <Textarea
                    id="area-description"
                    value={newArea.description}
                    onChange={(e) =>
                      setNewArea({ ...newArea, description: e.target.value })
                    }
                    placeholder="Ej: Área encargada de la gestión del personal"
                    rows={2}
                  />
                </div>
                <Button
                  onClick={handleAddArea}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <IconPlus className="w-4 h-4 mr-2" />
                  Agregar Área
                </Button>
              </div>

              {areas.length > 0 && (
                <div className="space-y-2">
                  <Label>Áreas agregadas ({areas.length})</Label>
                  <div className="space-y-2">
                    {areas.map((area) => (
                      <div
                        key={area.tempId}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{area.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {area.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveArea(area.tempId)}
                        >
                          <IconTrash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Anterior
                </Button>
                <Button onClick={handleAreasNext}>Siguiente</Button>
              </div>
            </>
          )}

          {/* Step 3: Departments */}
          {currentStep === 3 && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Selecciona un Área</Label>
                  <div className="flex flex-wrap gap-2">
                    {areas.map((area) => (
                      <Badge
                        key={area.tempId}
                        variant={
                          selectedAreaId === area.tempId ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setSelectedAreaId(area.tempId)}
                      >
                        {area.name} ({area.departments.length})
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedAreaId && (
                  <>
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
                    <Button
                      onClick={handleAddDepartment}
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      <IconPlus className="w-4 h-4 mr-2" />
                      Agregar Departamento
                    </Button>
                  </>
                )}

                {selectedAreaId && (
                  <div className="space-y-2">
                    <Label>
                      Departamentos de{" "}
                      {areas.find((a) => a.tempId === selectedAreaId)?.name}
                    </Label>
                    <div className="space-y-2">
                      {areas
                        .find((a) => a.tempId === selectedAreaId)
                        ?.departments.map((dept) => (
                          <div
                            key={dept.tempId}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{dept.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {dept.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveDepartment(
                                  selectedAreaId,
                                  dept.tempId,
                                )
                              }
                            >
                              <IconTrash className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Anterior
                </Button>
                <Button onClick={handleDepartmentsNext}>Siguiente</Button>
              </div>
            </>
          )}

          {/* Step 4: Positions */}
          {currentStep === 4 && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Selecciona un Área</Label>
                  <div className="flex flex-wrap gap-2">
                    {areas.map((area) => (
                      <Badge
                        key={area.tempId}
                        variant={
                          selectedAreaId === area.tempId ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedAreaId(area.tempId);
                          setSelectedDepartmentId(null);
                        }}
                      >
                        {area.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedAreaId && (
                  <div className="space-y-2">
                    <Label>Selecciona un Departamento</Label>
                    <div className="flex flex-wrap gap-2">
                      {areas
                        .find((a) => a.tempId === selectedAreaId)
                        ?.departments.map((dept) => (
                          <Badge
                            key={dept.tempId}
                            variant={
                              selectedDepartmentId === dept.tempId
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => setSelectedDepartmentId(dept.tempId)}
                          >
                            {dept.name} ({dept.positions.length})
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}

                {selectedAreaId && selectedDepartmentId && (
                  <>
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
                        placeholder="Ej: Gerente de Recursos Humanos"
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
                        placeholder="Ej: Responsable de la gestión estratégica del talento humano"
                        rows={2}
                      />
                    </div>
                    <Button
                      onClick={handleAddPosition}
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      <IconPlus className="w-4 h-4 mr-2" />
                      Agregar Puesto
                    </Button>
                  </>
                )}

                {selectedAreaId && selectedDepartmentId && (
                  <div className="space-y-2">
                    <Label>
                      Puestos de{" "}
                      {
                        areas
                          .find((a) => a.tempId === selectedAreaId)
                          ?.departments.find(
                            (d) => d.tempId === selectedDepartmentId,
                          )?.name
                      }
                    </Label>
                    <div className="space-y-2">
                      {areas
                        .find((a) => a.tempId === selectedAreaId)
                        ?.departments.find(
                          (d) => d.tempId === selectedDepartmentId,
                        )
                        ?.positions.map((pos) => (
                          <div
                            key={pos.tempId}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{pos.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {pos.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemovePosition(
                                  selectedAreaId,
                                  selectedDepartmentId,
                                  pos.tempId,
                                )
                              }
                            >
                              <IconTrash className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  Anterior
                </Button>
                <Button onClick={handlePositionsNext}>Siguiente</Button>
              </div>
            </>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Empresa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Nombre:</span>{" "}
                      {companyData.name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {companyData.email}
                    </div>
                    <div>
                      <span className="font-medium">Teléfono:</span>{" "}
                      {companyData.phone}
                    </div>
                    <div>
                      <span className="font-medium">Industria:</span>{" "}
                      {companyData.industry}
                    </div>
                    <div>
                      <span className="font-medium">Dirección:</span>{" "}
                      {companyData.address}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Estructura Organizacional
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {areas.map((area) => (
                      <div key={area.tempId} className="space-y-2">
                        <div className="font-medium text-primary">
                          {area.name}
                        </div>
                        {area.departments.map((dept) => (
                          <div key={dept.tempId} className="ml-4 space-y-1">
                            <div className="font-medium">{dept.name}</div>
                            {dept.positions.map((pos) => (
                              <div
                                key={pos.tempId}
                                className="ml-4 text-sm text-muted-foreground"
                              >
                                • {pos.name}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium">Total de Áreas:</span>{" "}
                      {areas.length}
                    </div>
                    <div>
                      <span className="font-medium">
                        Total de Departamentos:
                      </span>{" "}
                      {areas.reduce(
                        (sum, area) => sum + area.departments.length,
                        0,
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Total de Puestos:</span>{" "}
                      {areas.reduce(
                        (sum, area) =>
                          sum +
                          area.departments.reduce(
                            (dSum, dept) => dSum + dept.positions.length,
                            0,
                          ),
                        0,
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(4)}>
                  Anterior
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Creando..." : "Crear Empresa"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
