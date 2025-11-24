export interface Employee {
  id: number
  firstName: string
  lastName: string
  documentType: string | null
  documentNumber: string | null
  cuil: string | null
  birthDate: string | null
  nationality: string | null
  gender: string | null
  civilStatus: string | null
  email: string
  phone: string | null
  address: string | null
  addressNumber: string | null
  addressFloor: string | null
  addressApartment: string | null
  addressPostalCode: string | null
  addressCity: string | null
  addressProvince: string | null
  position: {
    id: number
    name: string
    code: string | null
    description: string | null
    department: {
      id: number
      name: string
      code: string | null
      description: string | null
      area: {
        id: number
        name: string
        code: string | null
        description: string | null
        company: {
          id: number
          name: string
          address: string
          phone: string
          email: string
          industry: string | null
        }
      }
    }
  }
  contracts: Contract[]
  requests: Request[]
  healthRecords: HealthRecord[]
  evaluations: Evaluation[]
  familyMembers: FamilyMember[]
  emergencyContacts: EmergencyContact[]
}

export interface EmployeeCreateRequest {
  firstName: string
  lastName: string
  documentType?: string
  documentNumber?: string
  cuil?: string
  birthDate?: string
  nationality?: string
  gender?: string
  civilStatus?: string
  email: string
  phone?: string
  address?: string
  addressNumber?: string
  addressFloor?: string
  addressApartment?: string
  addressPostalCode?: string
  addressCity?: string
  addressProvince?: string
  positionId: number
}

export interface EmployeeUpdateRequest {
  firstName?: string
  lastName?: string
  documentType?: string
  documentNumber?: string
  cuil?: string
  birthDate?: string
  nationality?: string
  gender?: string
  civilStatus?: string
  email?: string
  phone?: string
  address?: string
  addressNumber?: string
  addressFloor?: string
  addressApartment?: string
  addressPostalCode?: string
  addressCity?: string
  addressProvince?: string
  positionId?: number
}

export interface EmployeesResponse {
  status: string
  data: {
    total: number
    pageSize: number
    offset: number
    results: Employee[]
  }
}

export interface EmployeeResponse {
  status: string
  data: Employee
}

// Contract types
export interface Contract {
  id: number
  contractType: string
  startDate: string
  endDate: string | null
  workSchedule: string | null
  salary: string
  compensation: string | null
}

export interface ContractCreateRequest {
  employeeId: number
  contractType: string
  startDate: string
  endDate?: string
  workSchedule?: string
  salary: number
  compensation?: string
}

export interface ContractUpdateRequest {
  employeeId?: number
  contractType?: string
  startDate?: string
  endDate?: string
  workSchedule?: string
  salary?: number
  compensation?: string
}

// Health Record types
export interface HealthRecord {
  id: number
  type: string
  result: string
  realizationDate: string
  expirationDate: string
}

export interface HealthRecordCreateRequest {
  employeeId: number
  type: string
  result: string
  realizationDate: string
  expirationDate: string
}

export interface HealthRecordUpdateRequest {
  employeeId?: number
  type?: string
  result?: string
  realizationDate?: string
  expirationDate?: string
}

// Evaluation types
export interface Evaluation {
  id: number
  period: string
  type: string
  date: string
  evaluator: string
  status: string
  globalScoreNumeric: number
  globalScoreScale: string
  feedback: string
  employeeAcknowledged: boolean
  employeeAcknowledgedAt: string | null
  notes: string | null
}

export interface EvaluationCreateRequest {
  employeeId: number
  period: string
  type: string
  date: string
  evaluator: string
  status: string
  globalScoreNumeric: number
  globalScoreScale: string
  feedback: string
  employeeAcknowledged?: boolean
  employeeAcknowledgedAt?: string
  notes?: string
}

export interface EvaluationUpdateRequest {
  employeeId?: number
  period?: string
  type?: string
  date?: string
  evaluator?: string
  status?: string
  globalScoreNumeric?: number
  globalScoreScale?: string
  feedback?: string
  employeeAcknowledged?: boolean
  employeeAcknowledgedAt?: string
  notes?: string
}

// Emergency Contact types
export interface EmergencyContact {
  id: number
  fullName: string
  primaryPhone: string
  secondaryPhone: string | null
  relationship: string
  address: string | null
}

export interface EmergencyContactCreateRequest {
  employeeId: number
  fullName: string
  primaryPhone: string
  secondaryPhone?: string
  relationship: string
  address?: string
}

export interface EmergencyContactUpdateRequest {
  employeeId?: number
  fullName?: string
  primaryPhone?: string
  secondaryPhone?: string
  relationship?: string
  address?: string
}

// Family Member types
export interface FamilyMember {
  id: number
  fullName: string
  dni: string
  birthDate: string
  relationship: string
  disability: boolean
  dependent: boolean
  schooling: boolean
}

export interface FamilyMemberCreateRequest {
  employeeId: number
  fullName: string
  dni: string
  birthDate: string
  relationship: string
  disability?: boolean
  dependent?: boolean
  schooling?: boolean
}

export interface FamilyMemberUpdateRequest {
  employeeId?: number
  fullName?: string
  dni?: string
  birthDate?: string
  relationship?: string
  disability?: boolean
  dependent?: boolean
  schooling?: boolean
}

// Request types
export interface Request {
  id: number
  type: string
  period: string | null
  absenceType: string | null
  startDate: string
  endDate: string
  returnDate: string | null
  notifiedAt: string | null
  daysCorresponding: number | null
  daysTaken: number | null
  daysAvailable: number | null
  daysRequested: number
  description: string | null
  justificationFileUrl: string | null
  date: string | null
  status: string
}

export interface RequestCreateRequest {
  employeeId: number
  type: string
  period?: string
  absenceType?: string
  startDate: string
  endDate: string
  returnDate?: string
  notifiedAt?: string
  daysCorresponding?: number
  daysTaken?: number
  daysAvailable?: number
  daysRequested: number
  description?: string
  justificationFileUrl?: string
  date?: string
  status: string
}

export interface RequestUpdateRequest {
  employeeId?: number
  type?: string
  period?: string
  absenceType?: string
  startDate?: string
  endDate?: string
  returnDate?: string
  notifiedAt?: string
  daysCorresponding?: number
  daysTaken?: number
  daysAvailable?: number
  daysRequested?: number
  description?: string
  justificationFileUrl?: string
  date?: string
  status?: string
}
