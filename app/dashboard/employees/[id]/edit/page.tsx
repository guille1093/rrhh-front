import { MultiStepEmployeeForm } from "@/components/employees/multi-step-employee-form"

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <MultiStepEmployeeForm employeeId={Number(params.id)} />
    </div>
  )
}
