import type { Company } from "@/types/organizational-structure";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building, Briefcase } from "lucide-react";
import { withEmployeeCounts } from "@/lib/withEmployeeCounts";

interface OrganizationalChartProps {
  company: Company;
}

export default function OrganizationalChart({
  company,
}: OrganizationalChartProps) {
  const companyWithCounts = withEmployeeCounts(company);
  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-muted/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">
                {companyWithCounts.name}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm">
              <Users className="mr-1 h-3 w-3" />
              {companyWithCounts.areas?.reduce(
                (acc, area) => acc + (area.employeeCount || 0),
                0,
              ) || 0}{" "}
              empleados
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            {companyWithCounts.areas?.map((area) => (
              <div
                key={area.id}
                className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-border"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="relative z-10 -ml-[29px] flex h-6 w-6 items-center justify-center rounded-full border bg-background">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{area.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {area.employeeCount || 0} emp.
                  </Badge>
                </div>

                <div className="grid gap-4 pl-4 md:grid-cols-2 lg:grid-cols-3">
                  {area.departments?.map((dept) => (
                    <Card key={dept.id} className="overflow-hidden">
                      <div className="bg-muted/30 p-3 border-b flex justify-between items-center">
                        <span className="font-medium">{dept.name}</span>
                        <Badge variant="secondary" className="text-[10px] h-5">
                          {dept.employeeCount || 0}
                        </Badge>
                      </div>
                      <div className="p-3">
                        {dept.positions && dept.positions.length > 0 ? (
                          <ul className="space-y-2">
                            {dept.positions.map((pos) => (
                              <li
                                key={pos.id}
                                className="flex items-center justify-between text-sm text-muted-foreground bg-muted/10 p-2 rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  <Briefcase className="h-3 w-3" />
                                  <span>{pos.name}</span>
                                </div>
                                <span className="text-xs font-medium">
                                  {pos.employeeCount || 0}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">
                            Sin puestos definidos
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                  {(!area.departments || area.departments.length === 0) && (
                    <p className="text-sm text-muted-foreground italic col-span-full">
                      No hay departamentos registrados
                    </p>
                  )}
                </div>
              </div>
            ))}
            {(!companyWithCounts.areas ||
              companyWithCounts.areas.length === 0) && (
              <p className="text-center text-muted-foreground py-8">
                No hay áreas registradas en esta empresa
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
