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
import { PositionsAPI } from "@/lib/positions-api";
import { DepartmentsAPI } from "@/lib/departments-api";
import type { Position, Department } from "@/types/organizational-structure";
import { toast } from "sonner";

interface PositionFormProps {
  position?: Position;
  onSave: (position: Position) => void;
  onCancel: () => void;
  formRef?: React.RefObject<HTMLFormElement>;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

export function PositionForm({
  position,
  onSave,
  onCancel,
  formRef,
  loading = false,
  setLoading,
}: PositionFormProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    name: position?.name || "",
    description: position?.description || "",
    departmentId: position?.department?.id?.toString() || "",
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await DepartmentsAPI.getDepartments({
        orderBy: "name",
        orderType: "ASC",
        offset: 0,
        pageSize: 100,
      });
      setDepartments(response.data.results);
    } catch (error) {
      console.error("Error loading departments:", error);
      toast.error("Error al cargar departamentos");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setLoading) setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        departmentId: Number(formData.departmentId),
      };

      let response;
      if (position) {
        response = await PositionsAPI.updatePosition(position.id, payload);
        toast.success("Puesto actualizado exitosamente");
      } else {
        response = await PositionsAPI.createPosition(payload);
        toast.success("Puesto creado exitosamente");
      }
      onSave(response.data);
    } catch (error) {
      console.error("Error saving position:", error);
      toast.error(
        position ? "Error al actualizar puesto" : "Error al crear puesto",
      );
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Puesto</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Gerente de Recursos Humanos"
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
          placeholder="Ej: Responsable de la gestión estratégica del talento humano"
          required
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="departmentId">Departamento</Label>
        <Select
          value={formData.departmentId}
          onValueChange={(value) =>
            setFormData({ ...formData, departmentId: value })
          }
        >
          <SelectTrigger id="departmentId">
            <SelectValue placeholder="Selecciona un departamento" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((department) => (
              <SelectItem key={department.id} value={department.id.toString()}>
                {department.name}
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
            {loading ? "Guardando..." : position ? "Actualizar" : "Crear"}
          </Button>
        </div>
      )}
    </form>
  );
}
