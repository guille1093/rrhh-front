"use client";

import { MultiStepCompanyForm } from "@/components/companies/multi-step-company-form";
import { RouteGuard } from "@/components/auth/route-guard";

export default function CreateCompanyPage() {
  return (
    <RouteGuard requiredPermission="read:roles">
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Crear Nueva Empresa</h1>
          <p className="text-muted-foreground">
            Crea una empresa con su estructura organizacional
          </p>
        </div>
        <MultiStepCompanyForm />
      </div>
    </RouteGuard>
  );
}
