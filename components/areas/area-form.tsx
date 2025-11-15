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
import { AreasAPI } from "@/lib/areas-api";
import { CompaniesAPI } from "@/lib/companies-api";
import type { Area, Company } from "@/types/organizational-structure";
import { toast } from "sonner";

interface AreaFormProps {
  area?: Area;
  onSave: (area: Area) => void;
  onCancel: () => void;
  formRef?: React.RefObject<HTMLFormElement>;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

export function AreaForm({
  area,
  onSave,
  onCancel,
  formRef,
  loading = false,
  setLoading,
}: AreaFormProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    name: area?.name || "",
    description: area?.description || "",
    companyId: area?.company?.id.toString() || "",
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await CompaniesAPI.getCompanies({
        orderBy: "name",
        orderType: "ASC",
        offset: 0,
        pageSize: 100,
      });
      setCompanies(response.data.results);
    } catch (error) {
      console.error("Error loading companies:", error);
      toast.error("Error al cargar empresas");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setLoading) setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        companyId: Number(formData.companyId),
      };

      let response;
      if (area) {
        response = await AreasAPI.updateArea(area.id, payload);
        toast.success("Área actualizada exitosamente");
      } else {
        response = await AreasAPI.createArea(payload);
        toast.success("Área creada exitosamente");
      }
      onSave(response.data);
    } catch (error) {
      console.error("Error saving area:", error);
      toast.error(area ? "Error al actualizar área" : "Error al crear área");
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Área</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Recursos Humanos"
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
          placeholder="Ej: Área encargada de la gestión del personal"
          required
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyId">Empresa</Label>
        <Select
          value={formData.companyId}
          onValueChange={(value) =>
            setFormData({ ...formData, companyId: value })
          }
        >
          <SelectTrigger id="companyId">
            <SelectValue placeholder="Selecciona una empresa" />
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

      {!formRef && (
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : area ? "Actualizar" : "Crear"}
          </Button>
        </div>
      )}
    </form>
  );
}
