"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ContractType {
  contracttype: string
  employeecount: string
}

interface ContractTypesProps {
  data: ContractType[]
}

export function ContractTypes({ data }: ContractTypesProps) {
  const chartData = data.map((item) => ({
    type: item.contracttype,
    count: Number.parseInt(item.employeecount),
  }))

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Empleados por Tipo de Contrato
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="var(--chart-1)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
