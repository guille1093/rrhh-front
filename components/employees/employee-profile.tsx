"use client";
import React from "react";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEmployee } from "@/lib/employees-api";
import {
  createContract,
  updateContract,
  deleteContract,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  createRequest,
  updateRequest,
  deleteRequest,
} from "@/lib/employees-api";
import type {
  Employee,
  Contract,
  HealthRecord,
  Evaluation,
  EmergencyContact,
  FamilyMember,
  Request,
} from "@/types/employee";
import { Pencil, Trash2, Plus, SignalZero } from "lucide-react";
import { endpointServerChangedSubscribe } from "next/dist/build/swc/generated-native";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface EmployeeProfileProps {
  employeeId: number;
}

export function EmployeeProfile({ employeeId }: EmployeeProfileProps) {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployee();
  }, [employeeId]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const response = await getEmployee(employeeId);
      setEmployee(response.data);
    } catch (error) {
      console.error("Failed to load employee:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !employee) {
    return <div className="text-center py-8">Cargando...</div>;
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
        <Button
          onClick={() => router.push(`/dashboard/employees/${employeeId}/edit`)}
        >
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
          <ContractsTab
            employeeId={employeeId}
            contracts={employee.contracts}
            onUpdate={loadEmployee}
          />
        </TabsContent>

        <TabsContent value="health">
          <HealthRecordsTab
            employeeId={employeeId}
            records={employee.healthRecords}
            onUpdate={loadEmployee}
          />
        </TabsContent>

        <TabsContent value="evaluations">
          <EvaluationsTab
            employeeId={employeeId}
            evaluations={employee.evaluations}
            onUpdate={loadEmployee}
          />
        </TabsContent>

        <TabsContent value="emergency">
          <EmergencyContactsTab
            employeeId={employeeId}
            contacts={employee.emergencyContacts}
            onUpdate={loadEmployee}
          />
        </TabsContent>

        <TabsContent value="family">
          <FamilyMembersTab
            employeeId={employeeId}
            members={employee.familyMembers}
            onUpdate={loadEmployee}
          />
        </TabsContent>

        <TabsContent value="requests">
          <RequestsTab
            employeeId={employeeId}
            requests={employee.requests}
            onUpdate={loadEmployee}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Contracts Tab
function ContractsTab({
  employeeId,
  contracts,
  onUpdate,
}: {
  employeeId: number;
  contracts: Contract[];
  onUpdate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    contractType: "",
    startDate: "",
    endDate: "",
    workSchedule: "",
    salary: "",
    compensation: "",
  });

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateContract(editingId, {
          ...formData,
          salary: Number(formData.salary),
        });
      } else {
        await createContract({
          ...formData,
          employeeId,
          salary: Number(formData.salary),
        });
      }
      setOpen(false);
      setEditingId(null);
      setFormData({
        contractType: "",
        startDate: "",
        endDate: "",
        workSchedule: "",
        salary: "",
        compensation: "",
      });
      toast.success(
        editingId
          ? "Contrato actualizado correctamente"
          : "Contrato creado correctamente",
      );
      onUpdate();
    } catch (error) {
      console.error("[v0] Failed to save contract:", error);
      toast.error("Error al guardar el contrato");
    }
  };

  const handleEdit = (contract: Contract) => {
    setEditingId(contract.id);
    setFormData({
      contractType: contract.contractType,
      startDate: contract.startDate,
      endDate: contract.endDate || "",
      workSchedule: contract.workSchedule || "",
      salary: contract.salary,
      compensation: contract.compensation || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este contrato?")) return;
    try {
      await deleteContract(id);
      toast.success("Contrato eliminado correctamente");
      onUpdate();
    } catch (error) {
      console.error("[v0] Failed to delete contract:", error);
      toast.error("Error al eliminar el contrato");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Contratos</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="flex justify-end mb-4">
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    contractType: "",
                    startDate: "",
                    endDate: "",
                    workSchedule: "",
                    salary: "",
                    compensation: "",
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Contrato
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar" : "Nuevo"} Contrato
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Tipo de Contrato</Label>
                  {/* Tooltip de información */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16v-4m0-4h.01"
                          />
                        </svg>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      <ul className="list-disc ml-4 space-y-1">
                        <li>
                          <b>Relación de Dependencia:</b> La empresa paga cargas
                          sociales (jubilación, obra social, ART). El estándar
                          es el contrato por tiempo indeterminado. El periodo de
                          prueba son los primeros 3 meses (Art. 92 bis). Plazo
                          fijo tiene fecha de fin y requiere preaviso especial.
                          Eventual es para necesidades extraordinarias.
                          Teletrabajo debe registrarse por ley.
                        </li>
                        <li>
                          <b>No Laborales / Extracontractuales:</b> Incluye
                          Locación de Servicios, Monotributistas, Responsables
                          Inscriptos, Honorarios y Contrato de Obra. No tienen
                          recibo de sueldo ni vacaciones pagas automáticas.
                          Deben presentar constancia de inscripción y factura
                          mensual.
                        </li>
                        <li>
                          <b>Formativos:</b> Pasantía Educativa, Beca y Ad
                          honorem. No son empleados ni freelancers. La pasantía
                          tiene duración máxima y asignación estímulo.
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, contractType: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione tipo de contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="Relacion de dependencia"
                      disabled
                      className="opacity-100 font-bold"
                    >
                      Relación de Dependencia (Ley 20.744 - LCT)
                    </SelectItem>
                    <SelectItem value="Indeterminado">
                      Contrato por Tiempo Indeterminado (Efectivo)
                    </SelectItem>
                    <SelectItem value="Periodo de Prueba">
                      Periodo de Prueba (Art. 92 bis)
                    </SelectItem>
                    <SelectItem value="Plazo Fijo">
                      Contrato a Plazo Fijo
                    </SelectItem>
                    <SelectItem value="Eventual">Contrato Eventual</SelectItem>
                    <SelectItem value="Teletrabajo">
                      Contrato de Teletrabajo (Ley 27.555)
                    </SelectItem>
                    <SelectItem
                      value="No Laborales / Extracontractuales (Freelancers / Outsourcing)"
                      disabled
                      className="opacity-100 font-bold mt-2"
                    >
                      No Laborales / Extracontractuales (Freelancers /
                      Outsourcing)
                    </SelectItem>
                    <SelectItem value="Locación de Servicios">
                      Locación de Servicios (Contractor / Freelancer)
                    </SelectItem>
                    <SelectItem value="Monotributista">
                      Monotributista
                    </SelectItem>
                    <SelectItem value="Responsable Inscripto">
                      Responsable Inscripto (Autónomo)
                    </SelectItem>
                    <SelectItem value="Honorarios">Honorarios</SelectItem>
                    <SelectItem value="Contrato de Obra">
                      Contrato de Obra
                    </SelectItem>
                    <SelectItem
                      value="Formativos (Educativos)"
                      disabled
                      className="opacity-100 font-bold mt-2"
                    >
                      Formativos (Educativos)
                    </SelectItem>
                    <SelectItem value="Pasantía Educativa">
                      Pasantía Educativa (Ley 26.427)
                    </SelectItem>
                    <SelectItem value="Beca">Beca</SelectItem>
                    <SelectItem value="Ad honorem">Ad honorem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha Inicio</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha Fin</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Horario</Label>
                <Input
                  value={formData.workSchedule}
                  onChange={(e) =>
                    setFormData({ ...formData, workSchedule: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Salario</Label>
                <Input
                  type="number"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Compensación</Label>
                <Input
                  value={formData.compensation}
                  onChange={(e) =>
                    setFormData({ ...formData, compensation: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                Guardar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(contract)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(contract.id)}
                    >
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
  );
}

// Health Records Tab
function HealthRecordsTab({
  employeeId,
  records,
  onUpdate,
}: {
  employeeId: number;
  records: HealthRecord[];
  onUpdate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    type: "",
    result: "",
    realizationDate: "",
    expirationDate: "",
  });

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateHealthRecord(editingId, formData);
      } else {
        await createHealthRecord({ ...formData, employeeId });
      }
      setOpen(false);
      setEditingId(null);
      setFormData({
        type: "",
        result: "",
        realizationDate: "",
        expirationDate: "",
      });
      toast.success(
        editingId
          ? "Registro de salud actualizado correctamente"
          : "Registro de salud creado correctamente",
      );
      onUpdate();
    } catch (error) {
      console.error("[v0] Failed to save health record:", error);
      toast.error("Error al guardar el registro de salud");
    }
  };

  const handleEdit = (record: HealthRecord) => {
    setEditingId(record.id);
    setFormData({
      type: record.type,
      result: record.result,
      realizationDate: record.realizationDate,
      expirationDate: record.expirationDate,
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este registro?")) return;
    try {
      await deleteHealthRecord(id);
      toast.success("Registro de salud eliminado correctamente");
      onUpdate();
    } catch (error) {
      console.error("[v0] Failed to delete health record:", error);
      toast.error("Error al eliminar el registro de salud");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Registros de Salud</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="flex justify-end mb-4">
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    type: "",
                    result: "",
                    realizationDate: "",
                    expirationDate: "",
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Registro de Salud
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar" : "Nuevo"} Registro de Salud
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-ocupacional">
                      Pre-ocupacional
                    </SelectItem>
                    <SelectItem value="Periódico">Periódico</SelectItem>
                    <SelectItem value="Post-ocupacional">
                      Post-ocupacional
                    </SelectItem>
                    <SelectItem value="Retorno al trabajo">
                      Retorno al trabajo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Resultado</Label>
                <Select
                  value={formData.result}
                  onValueChange={(value) =>
                    setFormData({ ...formData, result: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apto">Apto</SelectItem>
                    <SelectItem value="Apto con preexistencias">
                      Apto con preexistencias
                    </SelectItem>
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        realizationDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha Vencimiento</Label>
                  <Input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expirationDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                Guardar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(record)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(record.id)}
                    >
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
  );
}

// Evaluations Tab (CRUD completo)
function EvaluationsTab({
  employeeId,
  evaluations,
  onUpdate,
}: {
  employeeId: number;
  evaluations: any[];
  onUpdate: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("fromdsa save the thing", formData);
    formData.globalScoreNumeric = parseFloat(formData.globalScoreNumeric);
    if (editingId) {
      await updateEvaluation(editingId, formData);
    } else {
      await createEvaluation({ ...formData, employeeId });
    }
    setOpen(false);
    setEditingId(null);
    setFormData({});
    toast.success(
      editingId
        ? "Evaluación actualizada correctamente"
        : "Evaluación creada correctamente",
    );
    await onUpdate();
    setLoading(false);
  };

  const handleEdit = (ev: any) => {
    setEditingId(ev.id);
    setFormData(ev);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    await deleteEvaluation(id);
    await onUpdate();
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluaciones de Desempeño</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="flex justify-end mb-4">
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditingId(null);
                  setFormData({});
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Evaluación
              </Button>
            </DialogTrigger>
          </div>
          {loading ? (
            <div>Cargando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Periodo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Evaluador</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Puntaje</TableHead>
                  <TableHead>Escala</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations?.map((ev) => (
                  <TableRow key={ev.id}>
                    <TableCell>{ev.period}</TableCell>
                    <TableCell>{ev.type}</TableCell>
                    <TableCell>{ev.date}</TableCell>
                    <TableCell>{ev.evaluator}</TableCell>
                    <TableCell>{ev.status}</TableCell>
                    <TableCell>{ev.globalScoreNumeric}</TableCell>
                    <TableCell>{ev.globalScoreScale}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(ev)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(ev.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Evaluación" : "Nueva Evaluación"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-2 mt-4" onSubmit={handleSubmit}>
              <div>
                <div className="flex items-center gap-2">
                  <label className="block text-xs font-semibold mb-1">
                    Periodo
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16v-4m0-4h.01"
                          />
                        </svg>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      Define el lapso evaluado: anual, semestral, trimestral,
                      cierre de período de prueba, fin de proyecto o fuera de
                      calendario.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={formData.period || ""}
                  onValueChange={(v) => setFormData({ ...formData, period: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Anual">Anual</SelectItem>
                    <SelectItem value="Semestral 1">
                      {new Date().getFullYear()} - 1er Semestre
                    </SelectItem>
                    <SelectItem value="Semestral 2">
                      {new Date().getFullYear()} - 2do Semestre
                    </SelectItem>
                    <SelectItem value="Q1">Trimestral / Q1</SelectItem>
                    <SelectItem value="Q2">Trimestral / Q2</SelectItem>
                    <SelectItem value="Q3">Trimestral / Q3</SelectItem>
                    <SelectItem value="Q4">Trimestral / Q4</SelectItem>
                    <SelectItem value="Cierre de Período de Prueba">
                      Cierre de Período de Prueba
                    </SelectItem>
                    <SelectItem value="Fin de Proyecto">
                      Fin de Proyecto
                    </SelectItem>
                    <SelectItem value="Ad-hoc / Extraordinaria">
                      Ad-hoc / Extraordinaria
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <label className="block text-xs font-semibold mb-1">
                    Tipo de Evaluación
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16v-4m0-4h.01"
                          />
                        </svg>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      Define la metodología y alcance: quién evalúa a quién
                      (auto, jefe, pares, 360°) y el enfoque (competencias,
                      objetivos, mixto, potencial).
                      <ul className="list-disc ml-4 mt-1">
                        <li>
                          <b>Autoevaluación:</b> El empleado se evalúa a sí
                          mismo.
                        </li>
                        <li>
                          <b>90° (Descendente):</b> Solo el jefe evalúa al
                          subordinado.
                        </li>
                        <li>
                          <b>180° (Pares + Jefe):</b> Incluye la visión de
                          compañeros y jefe.
                        </li>
                        <li>
                          <b>270° (Ascendente):</b> El empleado evalúa a su
                          jefe.
                        </li>
                        <li>
                          <b>360° (Integral):</b> Jefe, pares, subordinados y
                          clientes.
                        </li>
                        <li>
                          <b>Por Competencias:</b> Evalúa habilidades blandas y
                          técnicas.
                        </li>
                        <li>
                          <b>Por Objetivos:</b> Evalúa cumplimiento de metas
                          numéricas.
                        </li>
                        <li>
                          <b>Mixta:</b> Combina competencias y objetivos.
                        </li>
                        <li>
                          <b>Potencial:</b> Evalúa la capacidad futura de
                          crecimiento.
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={formData.type || ""}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione tipo de evaluación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Autoevaluación">
                      Autoevaluación
                    </SelectItem>
                    <SelectItem value="90° (Descendente)">
                      90° (Descendente)
                    </SelectItem>
                    <SelectItem value="180° (Pares + Jefe)">
                      180° (Pares + Jefe)
                    </SelectItem>
                    <SelectItem value="270° (Ascendente)">
                      270° (Ascendente)
                    </SelectItem>
                    <SelectItem value="360° (Integral)">
                      360° (Integral)
                    </SelectItem>
                    <SelectItem value="Por Competencias">
                      Por Competencias
                    </SelectItem>
                    <SelectItem value="Por Objetivos">
                      Por Objetivos (KPIs / OKRs)
                    </SelectItem>
                    <SelectItem value="Mixta">Mixta</SelectItem>
                    <SelectItem value="Potencial">Potencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Fecha
                </label>
                <Input
                  type="date"
                  placeholder="Fecha"
                  value={formData.date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Evaluador
                </label>
                <Input
                  type="text"
                  placeholder="Evaluador"
                  value={formData.evaluator || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, evaluator: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <label className="block text-xs font-semibold mb-1">
                    Estado
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16v-4m0-4h.01"
                          />
                        </svg>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      Estado del proceso de evaluación: Pendiente, En curso,
                      Finalizada o Firmada.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={formData.status || ""}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En curso">En curso</SelectItem>
                    <SelectItem value="Finalizada">Finalizada</SelectItem>
                    <SelectItem value="Firmada">Firmada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Puntaje
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Puntaje"
                  value={formData.globalScoreNumeric || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      globalScoreNumeric: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <label className="block text-xs font-semibold mb-1">
                    Escala
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16v-4m0-4h.01"
                          />
                        </svg>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      Escala de valoración: Supera expectativas, Cumple o
                      Necesita mejora.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={formData.globalScoreScale || ""}
                  onValueChange={(v) =>
                    setFormData({ ...formData, globalScoreScale: v })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Supera expectativas">
                      Supera expectativas
                    </SelectItem>
                    <SelectItem value="Cumple">Cumple</SelectItem>
                    <SelectItem value="Necesita mejora">
                      Necesita mejora
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Feedback
                </label>
                <Input
                  type="text"
                  placeholder="Feedback"
                  value={formData.feedback || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, feedback: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Reconocido por empleado
                </label>
                <Input
                  type="checkbox"
                  checked={formData.employeeAcknowledged || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employeeAcknowledged: e.target.checked,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Reconocido el
                </label>
                <Input
                  type="datetime-local"
                  placeholder="Reconocido el"
                  value={formData.employeeAcknowledgedAt || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employeeAcknowledgedAt: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Notas
                </label>
                <Input
                  type="text"
                  placeholder="Notas"
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Guardar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// Emergency Contacts Tab (CRUD completo)
function EmergencyContactsTab({
  employeeId,
  contacts,
  onUpdate,
}: {
  employeeId: number;
  contacts: any[];
  onUpdate: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      await updateEmergencyContact(editingId, formData);
    } else {
      await createEmergencyContact({ ...formData, employeeId });
    }
    setOpen(false);
    setEditingId(null);
    setFormData({});
    await onUpdate();
    setLoading(false);
  };

  const handleEdit = (c: any) => {
    setEditingId(c.id);
    setFormData(c);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    await deleteEmergencyContact(id);
    await onUpdate();
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contactos de Emergencia</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="flex justify-end mb-4">
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditingId(null);
                  setFormData({});
                }}
              >
                <Plus />
                Nuevo Contacto
              </Button>
            </DialogTrigger>
          </div>
          {loading ? (
            <div>Cargando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Teléfono 1</TableHead>
                  <TableHead>Teléfono 2</TableHead>
                  <TableHead>Parentesco</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts?.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.fullName}</TableCell>
                    <TableCell>{c.primaryPhone}</TableCell>
                    <TableCell>{c.secondaryPhone}</TableCell>
                    <TableCell>{c.relationship}</TableCell>
                    <TableCell>{c.address}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(c)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Contacto" : "Nuevo Contacto"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-2 mt-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Nombre completo
                </label>
                <Input
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.fullName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Teléfono principal
                </label>
                <Input
                  type="text"
                  placeholder="Teléfono principal"
                  value={formData.primaryPhone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryPhone: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Teléfono secundario
                </label>
                <Input
                  type="text"
                  placeholder="Teléfono secundario"
                  value={formData.secondaryPhone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, secondaryPhone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Parentesco
                </label>
                <Input
                  type="text"
                  placeholder="Parentesco"
                  value={formData.relationship || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Dirección
                </label>
                <Input
                  type="text"
                  placeholder="Dirección"
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Guardar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// Family Members Tab (CRUD completo)
function FamilyMembersTab({
  employeeId,
  members,
  onUpdate,
}: {
  employeeId: number;
  members: any[];
  onUpdate: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editingId) {
      await updateFamilyMember(editingId, formData);
    } else {
      await createFamilyMember({ ...formData, employeeId });
    }
    setOpen(false);
    setEditingId(null);
    setFormData({});
    await onUpdate();
    setLoading(false);
  };

  const handleEdit = (m: any) => {
    setEditingId(m.id);
    setFormData(m);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    await deleteFamilyMember(id);
    await onUpdate();
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Familiares</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="flex justify-end mb-4">
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditingId(null);
                  setFormData({});
                }}
              >
                <Plus />
                Nuevo Familiar
              </Button>
            </DialogTrigger>
          </div>
          {loading ? (
            <div>Cargando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Fecha Nac.</TableHead>
                  <TableHead>Parentesco</TableHead>
                  <TableHead>Discapacidad</TableHead>
                  <TableHead>Dependiente</TableHead>
                  <TableHead>Escolaridad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members?.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.fullName}</TableCell>
                    <TableCell>{m.dni}</TableCell>
                    <TableCell>{m.birthDate}</TableCell>
                    <TableCell>{m.relationship}</TableCell>
                    <TableCell>{m.disability ? "Sí" : "No"}</TableCell>
                    <TableCell>{m.dependent ? "Sí" : "No"}</TableCell>
                    <TableCell>{m.schooling ? "Sí" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(m)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(m.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Familiar" : "Nuevo Familiar"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-2 mt-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Nombre completo
                </label>
                <Input
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.fullName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">DNI</label>
                <Input
                  type="text"
                  placeholder="DNI"
                  value={formData.dni || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dni: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Fecha de nacimiento
                </label>
                <Input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  value={formData.birthDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Parentesco
                </label>
                <Input
                  type="text"
                  placeholder="Parentesco"
                  value={formData.relationship || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Discapacidad
                </label>
                <Input
                  type="checkbox"
                  checked={formData.disability || false}
                  onChange={(e) =>
                    setFormData({ ...formData, disability: e.target.checked })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Dependiente
                </label>
                <Input
                  type="checkbox"
                  checked={formData.dependent || false}
                  onChange={(e) =>
                    setFormData({ ...formData, dependent: e.target.checked })
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Escolaridad
                </label>
                <Input
                  type="checkbox"
                  checked={formData.schooling || false}
                  onChange={(e) =>
                    setFormData({ ...formData, schooling: e.target.checked })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Guardar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// Requests Tab (CRUD completo)
function RequestsTab({
  employeeId,
  requests,
  onUpdate,
}: {
  employeeId: number;
  requests: any[];
  onUpdate: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    formData.daysAvailable = Number(formData.daysAvailable) || 0;
    formData.daysCorresponding = Number(formData.daysCorresponding) || 0;
    formData.daysRequested = Number(formData.daysRequested) || 0;
    formData.daysTaken = Number(formData.daysTaken) || 0;
    setLoading(true);
    if (editingId) {
      await updateRequest(editingId, formData);
    } else {
      await createRequest({ ...formData, employeeId });
    }
    setOpen(false);
    setEditingId(null);
    setFormData({});
    await onUpdate();
    setLoading(false);
  };

  const handleEdit = (r: any) => {
    setEditingId(r.id);
    setFormData(r);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    await deleteRequest(id);
    await onUpdate();
    setLoading(false);
  };

  // Renderiza campos dinámicos según el tipo de solicitud
  const renderDynamicFields = () => {
    if (formData.type === "Vacaciones") {
      return (
        <>
          <div>
            <label className="block text-xs font-semibold mb-1">Periodo</label>
            <Input
              type="text"
              placeholder="Periodo"
              value={formData.period || ""}
              onChange={(e) =>
                setFormData({ ...formData, period: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Días correspondientes
            </label>
            <Input
              type="number"
              placeholder="Días correspondientes"
              value={formData.daysCorresponding || ""}
              onChange={(e) =>
                setFormData({ ...formData, daysCorresponding: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Días tomados
            </label>
            <Input
              type="number"
              placeholder="Días tomados"
              value={formData.daysTaken || ""}
              onChange={(e) =>
                setFormData({ ...formData, daysTaken: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Días disponibles
            </label>
            <Input
              type="number"
              placeholder="Días disponibles"
              value={formData.daysAvailable || ""}
              onChange={(e) =>
                setFormData({ ...formData, daysAvailable: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Fecha inicio
            </label>
            <Input
              type="date"
              placeholder="Fecha inicio"
              value={formData.startDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Fecha fin
            </label>
            <Input
              type="date"
              placeholder="Fecha fin"
              value={formData.endDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Fecha regreso
            </label>
            <Input
              type="date"
              placeholder="Fecha regreso"
              value={formData.returnDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, returnDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Notificado el
            </label>
            <Input
              type="date"
              placeholder="Notificado el"
              value={formData.notifiedAt || ""}
              onChange={(e) =>
                setFormData({ ...formData, notifiedAt: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Días solicitados
            </label>
            <Input
              type="number"
              placeholder="Días solicitados"
              value={formData.daysRequested || ""}
              onChange={(e) =>
                setFormData({ ...formData, daysRequested: e.target.value })
              }
            />
          </div>
        </>
      );
    }
    if (formData.type === "Licencia" || formData.type === "Inasistencia") {
      return (
        <>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Motivo legal
            </label>
            <Select
              value={formData.absenceType || ""}
              onValueChange={(v) =>
                setFormData({ ...formData, absenceType: v })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione motivo legal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Matrimonio">
                  Matrimonio (LCT Art. 158)
                </SelectItem>
                <SelectItem value="Nacimiento de Hijo">
                  Nacimiento de Hijo (Paternidad)
                </SelectItem>
                <SelectItem value="Fallecimiento de Cónyuge, Hijo o Padres">
                  Fallecimiento de Cónyuge, Hijo o Padres
                </SelectItem>
                <SelectItem value="Fallecimiento de Hermano">
                  Fallecimiento de Hermano
                </SelectItem>
                <SelectItem value="Examen / Estudio">
                  Examen / Estudio
                </SelectItem>
                <SelectItem value="Accidente de Trabajo / Enfermedad Profesional (ART)">
                  Accidente de Trabajo / Enfermedad Profesional (ART)
                </SelectItem>
                <SelectItem value="Enfermedad Inculpable">
                  Enfermedad Inculpable
                </SelectItem>
                <SelectItem value="Maternidad">Maternidad</SelectItem>
                <SelectItem value="Estado de Excedencia">
                  Estado de Excedencia
                </SelectItem>
                <SelectItem value="Donación de Sangre">
                  Donación de Sangre
                </SelectItem>
                <SelectItem value="Citación Judicial">
                  Citación Judicial
                </SelectItem>
                <SelectItem value="Presidente de Mesa (Electoral)">
                  Presidente de Mesa (Electoral)
                </SelectItem>
                <SelectItem value="Mudanza">Mudanza</SelectItem>
                <SelectItem value="Día de Cumpleaños">
                  Día de Cumpleaños
                </SelectItem>
                <SelectItem value="Trámites Personales">
                  Trámites Personales
                </SelectItem>
                <SelectItem value="Compensatorio / Franco">
                  Compensatorio / Franco
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Fecha inicio
            </label>
            <Input
              type="date"
              placeholder="Fecha inicio"
              value={formData.startDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Fecha fin
            </label>
            <Input
              type="date"
              placeholder="Fecha fin"
              value={formData.endDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Días solicitados
            </label>
            <Input
              type="number"
              placeholder="Días solicitados"
              value={formData.daysRequested || ""}
              onChange={(e) =>
                setFormData({ ...formData, daysRequested: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              URL justificativo
            </label>
            <Input
              type="text"
              placeholder="URL justificativo"
              value={formData.justificationFileUrl || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  justificationFileUrl: e.target.value,
                })
              }
            />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="flex justify-end mb-4">
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  setEditingId(null);
                  setFormData({});
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Solicitud
              </Button>
            </DialogTrigger>
          </div>
          {loading ? (
            <div>Cargando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Periodo/Motivo</TableHead>
                  <TableHead>Fechas</TableHead>
                  <TableHead>Días</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>{r.period || r.absenceType}</TableCell>
                    <TableCell>
                      {r.startDate} - {r.endDate}
                    </TableCell>
                    <TableCell>{r.daysRequested}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(r)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Solicitud" : "Nueva Solicitud"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-2 mt-4" onSubmit={handleSubmit}>
              <Select
                value={formData.type || ""}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tipo de solicitud" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                  <SelectItem value="Licencia">Licencia</SelectItem>
                  <SelectItem value="Inasistencia">Inasistencia</SelectItem>
                </SelectContent>
              </Select>
              {renderDynamicFields()}
              <Input
                type="text"
                placeholder="Descripción"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <Select
                value={formData.status || ""}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="APROBADA">Aprobada</SelectItem>
                  <SelectItem value="RECHAZADA">Rechazada</SelectItem>
                  <SelectItem value="JUSTIFICADA">Justificada</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">
                Guardar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
