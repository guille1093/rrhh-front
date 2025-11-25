"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ContractHistory {
  contractid: number
  startdate: string
  enddate: string | null
  employeeid: number
  employeefirstname: string
  employeelastname: string
}

interface ContractHistoryProps {
  data: ContractHistory[]
}

export function ContractHistory({ data }: ContractHistoryProps) {
  // Generar datos para gráfico de contratos en el tiempo
  const months: Record<string, number> = {}
  data.forEach((contract) => {
    const date = new Date(contract.startdate)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    months[monthKey] = (months[monthKey] || 0) + 1
  })

  const chartData = Object.entries(months)
    .sort()
    .map(([month, count]) => ({
      month,
      count,
    }))

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Historial de Contratos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-sm mb-4">Evolución por mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="var(--chart-1)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3">Últimos contratos</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data.slice(0, 10).map((contract) => (
              <div key={contract.contractid} className="flex justify-between text-sm p-2 border rounded">
                <span>
                  {contract.employeefirstname} {contract.employeelastname}
                </span>
                <span className="text-muted-foreground">
                  {new Date(contract.startdate).toLocaleDateString("es-AR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
