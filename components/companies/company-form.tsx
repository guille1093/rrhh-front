"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CompaniesAPI } from "@/lib/companies-api";
import type { Company } from "@/types/organizational-structure";
import { toast } from "sonner";

interface CompanyFormProps {
  company?: Company;
  onSave: (company: Company) => void;
  onCancel: () => void;
  formRef?: React.RefObject<HTMLFormElement>;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

export function CompanyForm({
  company,
  onSave,
  onCancel,
  formRef,
  loading = false,
  setLoading,
}: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: company?.name || "",
    address: company?.address || "",
    email: company?.email || "",
    phone: company?.phone || "",
    industry: company?.industry || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setLoading) setLoading(true);

    try {
      let response;
      if (company) {
        response = await CompaniesAPI.updateCompany(company.id, formData);
        toast.success("Empresa actualizada exitosamente");
      } else {
        response = await CompaniesAPI.createCompany(formData);
        toast.success("Empresa creada exitosamente");
      }
      onSave(response.data);
    } catch (error) {
      console.error("Error saving company:", error);
      toast.error(
        company ? "Error al actualizar empresa" : "Error al crear empresa",
      );
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Empresa</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: TechCorp S.A."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Ej: contact@techcorp.com"
          required
          type="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Ej: +54 9 11 1234-5678"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industria</Label>
        <Input
          id="industry"
          value={formData.industry}
          onChange={(e) =>
            setFormData({ ...formData, industry: e.target.value })
          }
          placeholder="Ej: Tecnología"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          placeholder="Ej: Av. Principal 123, Ciudad"
          required
          rows={3}
        />
      </div>

      {!formRef && (
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : company ? "Actualizar" : "Crear"}
          </Button>
        </div>
      )}
    </form>
  );
}
