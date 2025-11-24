"use client"

import { MultiStepCompanyForm } from "@/components/companies/multi-step-company-form"
import { RouteGuard } from "@/components/auth/route-guard"

export default function EditCompanyPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <RouteGuard requiredPermission="read:roles">
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Editar Estructura Organizacional</h1>
          <p className="text-muted-foreground">Modifica las áreas, departamentos y puestos de la empresa.</p>
        </div>
        <MultiStepCompanyForm companyId={Number.parseInt(params.id)} />
      </div>
    </RouteGuard>
  )
}
