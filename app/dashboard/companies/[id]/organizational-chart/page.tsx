"use client";

import { useState, useEffect } from "react";
import { CompaniesAPI } from "@/lib/companies-api";
import OrganizationalChart from "@/components/companies/organizational-chart";
import { Company } from "@/types/organizational-structure";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function OrganizationalChartPage() {
  const params = useParams() as { id: string };
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!params?.id) return;
      try {
        setLoading(true);
        const response = await CompaniesAPI.getCompanyById(
          parseInt(params.id, 10),
        );
        setCompany(response.data);
      } catch (error) {
        console.error("Error loading company:", error);
        toast.error("Error al cargar la empresa");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p>Cargando estructura...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p>No se encontró la empresa.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Estructura de {company.name}</h1>
      <OrganizationalChart company={company} />
    </div>
  );
}
