import { EmployeeProfile } from "@/components/employees/employee-profile"

export default function EmployeeProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <EmployeeProfile employeeId={Number(params.id)} />
    </div>
  )
}
