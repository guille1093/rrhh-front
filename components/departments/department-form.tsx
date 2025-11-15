"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DepartmentsAPI } from "@/lib/departments-api";
import { AreasAPI } from "@/lib/areas-api";
import type { Department, Area } from "@/types/organizational-structure";
import { toast } from "sonner";

interface DepartmentFormProps {
  department?: Department;
  onSave: (department: Department) => void;
  onCancel: () => void;
  formRef?: React.RefObject<HTMLFormElement>;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

export function DepartmentForm({
  department,
  onSave,
  onCancel,
  formRef,
  loading = false,
  setLoading,
}: DepartmentFormProps) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [formData, setFormData] = useState({
    name: department?.name || "",
    description: department?.description || "",
    areaId: department?.area?.id?.toString() || "",
  });

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      const response = await AreasAPI.getAreas({
        orderBy: "name",
        orderType: "ASC",
        offset: 0,
        pageSize: 100,
      });
      setAreas(response.data.results);
    } catch (error) {
      console.error("Error loading areas:", error);
      toast.error("Error al cargar áreas");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setLoading) setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        areaId: Number(formData.areaId),
      };

      let response;
      if (department) {
        response = await DepartmentsAPI.updateDepartment(
          department.id,
          payload,
        );
        toast.success("Departamento actualizado exitosamente");
      } else {
        response = await DepartmentsAPI.createDepartment(payload);
        toast.success("Departamento creado exitosamente");
      }
      onSave(response.data);
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error(
        department
          ? "Error al actualizar departamento"
          : "Error al crear departamento",
      );
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Departamento</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Reclutamiento"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Ej: Departamento encargado del proceso de reclutamiento"
          required
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="areaId">Área</Label>
        <Select
          value={formData.areaId}
          onValueChange={(value) => setFormData({ ...formData, areaId: value })}
        >
          <SelectTrigger id="areaId">
            <SelectValue placeholder="Selecciona un área" />
          </SelectTrigger>
          <SelectContent>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id.toString()}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!formRef && (
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : department ? "Actualizar" : "Crear"}
          </Button>
        </div>
      )}
    </form>
  );
}
