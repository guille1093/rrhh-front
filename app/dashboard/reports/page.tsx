"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPendingRequests } from "@/lib/requests-api";
import eventsData from "../data.json";
import { EmployeeStatistics } from "../components/employee-statistics";
import { EmployeesByArea } from "../components/employees-by-area";
import { ContractTypes } from "../components/contract-types";
import { ContractHistory } from "../components/contract-history";
import { PendingRequests } from "../components/pending-requests";
import { UpcomingEvents } from "../components/upcoming-events";

import { CompaniesAPI } from "@/lib/companies-api";

async function getCompanyReport(companyId: number) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/employees/report/${companyId}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Error al obtener reportes");
  const data = await res.json();
  return data.data;
}

export default function DashboardPage() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Estado para los reportes y empresas
  const [report, setReport] = React.useState<any>(null);
  const [loadingReport, setLoadingReport] = React.useState(true);
  const [errorReport, setErrorReport] = React.useState<string | null>(null);

  const [companies, setCompanies] = React.useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<
    number | null
  >(null);

  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  // Cargar empresas al montar
  React.useEffect(() => {
    CompaniesAPI.getCompanies({ pageSize: 100 }).then((res) => {
      setCompanies(res.data.results);
      if (res.data.results.length > 0) {
        setSelectedCompanyId(res.data.results[0].id);
      }
    });
  }, []);

  // Cargar solicitudes pendientes
  React.useEffect(() => {
    getPendingRequests()
      .then(setPendingRequests)
      .catch(() => setPendingRequests([]));
  }, []);

  // Cargar reportes cuando cambia la empresa seleccionada
  React.useEffect(() => {
    if (!selectedCompanyId) return;
    setLoadingReport(true);
    getCompanyReport(selectedCompanyId)
      .then((data) => {
        setReport(data);
        setLoadingReport(false);
      })
      .catch((err) => {
        setErrorReport("Error al cargar reportes");
        setLoadingReport(false);
      });
  }, [selectedCompanyId]);

  return (
    <div className="space-y-6">
      {/* Selector de Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Filtro de Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedCompanyId?.toString() || ""}
            onValueChange={(val) => setSelectedCompanyId(Number(val))}
          >
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Seleccionar empresa" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loadingReport && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Cargando reportes...</p>
          </CardContent>
        </Card>
      )}
      {errorReport && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">{errorReport}</p>
          </CardContent>
        </Card>
      )}

      {report && !loadingReport && (
        <>
          <EmployeeStatistics
            totalEmployees={report.totalEmployees}
            activeEmployees={report.activeEmployees}
          />

          <EmployeesByArea data={report.byAreaDeptPosition} />

          <ContractTypes data={report.byContractType} />

          <ContractHistory data={report.contractsHistory} />
        </>
      )}
    </div>
  );
}
