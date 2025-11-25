// Agrega employeeCount a áreas, departamentos y posiciones de la estructura Company

import type { Company } from "@/types/organizational-structure";

export function withEmployeeCounts(company: Company): Company {
  const areas =
    company.areas?.map((area) => {
      let areaEmployeeCount = 0;

      const departments =
        area.departments?.map((dept) => {
          let deptEmployeeCount = 0;

          const positions =
            dept.positions?.map((pos) => {
              const count = pos.employees?.length || 0;
              deptEmployeeCount += count;
              return { ...pos, employeeCount: count };
            }) || [];

          areaEmployeeCount += deptEmployeeCount;
          return { ...dept, positions, employeeCount: deptEmployeeCount };
        }) || [];

      return { ...area, departments, employeeCount: areaEmployeeCount };
    }) || [];

  return { ...company, areas };
}
