"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck } from "lucide-react"

interface EmployeeStatisticsProps {
  totalEmployees: number
  activeEmployees: number
}

export function EmployeeStatistics({ totalEmployees, activeEmployees }: EmployeeStatisticsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
          <p className="text-xs text-muted-foreground">Total en la empresa</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Empleados Activos</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeEmployees}</div>
          <p className="text-xs text-muted-foreground">Activos en el sistema</p>
        </CardContent>
      </Card>
    </div>
  )
}
