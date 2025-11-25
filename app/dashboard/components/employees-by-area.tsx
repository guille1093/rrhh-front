"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface AreaDept {
  areaid: number;
  areaname: string;
  departmentid: number;
  departmentname: string;
  positionid: number;
  positionname: string;
  employeecount: string;
}

interface EmployeesByAreaProps {
  data: AreaDept[];
}

export function EmployeesByArea({ data }: EmployeesByAreaProps) {
  // Agrupar por área
  const byArea = data.reduce((acc, item) => {
    const area = acc.find((a) => a.areaid === item.areaid);
    if (area) {
      area.count += Number.parseInt(item.employeecount);
      if (
        !area.departments.find((d: any) => d.departmentid === item.departmentid)
      ) {
        area.departments.push({
          departmentid: item.departmentid,
          departmentname: item.departmentname,
          count: Number.parseInt(item.employeecount),
          positions: [
            {
              positionname: item.positionname,
              count: Number.parseInt(item.employeecount),
            },
          ],
        });
      }
    } else {
      acc.push({
        areaid: item.areaid,
        areaname: item.areaname,
        count: Number.parseInt(item.employeecount),
        departments: [
          {
            departmentid: item.departmentid,
            departmentname: item.departmentname,
            count: Number.parseInt(item.employeecount),
            positions: [
              {
                positionname: item.positionname,
                count: Number.parseInt(item.employeecount),
              },
            ],
          },
        ],
      });
    }
    return acc;
  }, [] as any[]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Empleados por Área, Departamento y Puesto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {byArea.map((area) => (
            <div key={area.areaid} className="border rounded-lg p-4">
              <div className="font-semibold text-base mb-3">
                {area.areaname} ({area.count})
              </div>
              <div className="ml-4 space-y-2">
                {area.departments.map((dept: any) => (
                  <div key={dept.departmentid}>
                    <div className="text-sm font-medium text-muted-foreground">
                      {dept.departmentname} ({dept.count})
                    </div>
                    <ul className="ml-4 text-xs space-y-1">
                      {dept.positions.map((pos: any, idx: number) => (
                        <li key={idx} className="text-muted-foreground">
                          • {pos.positionname}: {pos.count}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
