"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getPendingRequests } from "@/lib/requests-api";
import eventsData from "./data.json";

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

function PendingRequestsCard() {
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    getPendingRequests()
      .then(setPendingRequests)
      .catch(() => setPendingRequests([]));
  }, []);

  if (!pendingRequests.length) {
    return (
      <div className="mb-6">
        <div className="rounded-lg border bg-background p-6">
          <div className="font-semibold text-lg mb-2">
            Solicitudes Pendientes
          </div>
          <div className="text-muted-foreground">
            No hay solicitudes pendientes
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="rounded-lg border bg-background p-6">
        <div className="font-semibold text-lg mb-2">Solicitudes Pendientes</div>
        <div className="mb-2 text-base">
          {pendingRequests.length} solicitud(es) pendiente(s)
        </div>
        <ul>
          {pendingRequests.map((req) => (
            <li key={req.id} className="mb-1">
              <button
                className="text-blue-600 hover:underline"
                onClick={() =>
                  router.push(
                    `/dashboard/employees/${req.employee.id}/profile?tab=requests`,
                  )
                }
              >
                {req.employee.firstName} {req.employee.lastName} - {req.type}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export default function Page() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  // Estado para los reportes y empresas
  const [report, setReport] = React.useState<any>(null);
  const [loadingReport, setLoadingReport] = React.useState(true);
  const [errorReport, setErrorReport] = React.useState<string | null>(null);

  const [companies, setCompanies] = React.useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<
    number | null
  >(null);

  // Cargar empresas al montar
  React.useEffect(() => {
    CompaniesAPI.getCompanies({ pageSize: 100 }).then((res) => {
      setCompanies(res.data.results);
      if (res.data.results.length > 0) {
        setSelectedCompanyId(res.data.results[0].id);
      }
    });
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
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <PendingRequestsCard />
      </div>
      <div className="flex-1">
        <UpcomingEventsCard />
      </div>
      <div className="w-full md:w-auto flex-[2_2_0%]">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Reportes de empleados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1">
                Empresa
              </label>
              <Select
                value={selectedCompanyId?.toString() || ""}
                onValueChange={(val) => setSelectedCompanyId(Number(val))}
              >
                <SelectTrigger className="w-full">
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
            </div>
            {loadingReport && <div>Cargando reportes...</div>}
            {errorReport && <div className="text-red-600">{errorReport}</div>}
            {report && (
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Total empleados:</span>{" "}
                  {report.totalEmployees}
                </div>
                <div>
                  <span className="font-semibold">Empleados activos:</span>{" "}
                  {report.activeEmployees}
                </div>
                <div>
                  <span className="font-semibold">
                    Empleados por Área, Departamento y Puesto:
                  </span>
                  <ul className="ml-4 list-disc">
                    {report.byAreaDeptPosition.map((item: any) => (
                      <li
                        key={`${item.areaid}-${item.departmentid}-${item.positionid}`}
                      >
                        Área: <b>{item.areaname}</b> | Departamento:{" "}
                        <b>{item.departmentname}</b> | Puesto:{" "}
                        <b>{item.positionname}</b> — <b>{item.employeecount}</b>{" "}
                        empleado(s)
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold">
                    Empleados por tipo de contrato:
                  </span>
                  <ul className="ml-4 list-disc">
                    {report.byContractType.map((item: any) => (
                      <li key={item.contracttype}>
                        {item.contracttype}: <b>{item.employeecount}</b>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold">
                    Historial de contratos (para gráfico):
                  </span>
                  <ul className="ml-4 list-disc">
                    {report.contractsHistory.map((item: any) => (
                      <li key={item.contractid}>
                        {item.employeefirstname} {item.employeelastname} —
                        Inicio:{" "}
                        {item.startdate
                          ? new Date(item.startdate).toLocaleDateString("es-AR")
                          : "N/A"}
                        {item.enddate &&
                          ` | Fin: ${new Date(item.enddate).toLocaleDateString("es-AR")}`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Total Visitors</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Total for the last 3 months
              </span>
              <span className="@[540px]/card:hidden">Last 3 months</span>
            </CardDescription>
            <CardAction>
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={setTimeRange}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
              >
                <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
                <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
                <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
              </ToggleGroup>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                  size="sm"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last 3 months" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={1.0}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="mobile"
                  type="natural"
                  fill="url(#fillMobile)"
                  stroke="var(--color-mobile)"
                  stackId="a"
                />
                <Area
                  dataKey="desktop"
                  type="natural"
                  fill="url(#fillDesktop)"
                  stroke="var(--color-desktop)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UpcomingEventsCard() {
  // Tomar solo los próximos 5 eventos a partir de hoy
  const today = new Date();
  const upcoming = eventsData
    .filter((e) => new Date(e.fecha) >= today)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 5);

  return (
    <div className="mb-6">
      <div className="rounded-lg border bg-background p-6">
        <div className="font-semibold text-lg mb-2">Próximos eventos</div>
        {upcoming.length === 0 ? (
          <div className="text-muted-foreground">No hay eventos próximos</div>
        ) : (
          <ul>
            {upcoming.map((ev) => (
              <li key={ev.fecha + ev.nombre} className="mb-1">
                <span className="font-medium">{ev.nombre}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  (
                  {new Date(ev.fecha).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  - {ev.tipo})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
