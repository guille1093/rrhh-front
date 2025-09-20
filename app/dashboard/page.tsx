import { RouteGuard } from "@/components/auth/route-guard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PermissionsCard } from "@/components/dashboard/permissions-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building, FileText, BarChart3 } from "lucide-react"

export default function DashboardPage() {
  return (
    <RouteGuard>
      <div className="min-h-screen bg-background">
        <DashboardHeader />

        <main className="container py-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">Bienvenido al sistema de gestión de recursos humanos</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Empleados</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+10% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">+2 nuevos este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Solicitudes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">12 pendientes de revisión</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reportes</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">Generados esta semana</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <PermissionsCard />

              <Card>
                <CardHeader>
                  <CardTitle>Accesos Rápidos</CardTitle>
                  <CardDescription>Funciones más utilizadas del sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <button className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                      <Users className="h-5 w-5" />
                      <span>Gestionar Empleados</span>
                    </button>
                    <button className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                      <Building className="h-5 w-5" />
                      <span>Ver Departamentos</span>
                    </button>
                    <button className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                      <FileText className="h-5 w-5" />
                      <span>Revisar Solicitudes</span>
                    </button>
                    <button className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                      <BarChart3 className="h-5 w-5" />
                      <span>Generar Reportes</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  )
}
