import type {
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
  EmployeesResponse,
  EmployeeResponse,
  ContractCreateRequest,
  ContractUpdateRequest,
  HealthRecordCreateRequest,
  HealthRecordUpdateRequest,
  EvaluationCreateRequest,
  EvaluationUpdateRequest,
  EmergencyContactCreateRequest,
  EmergencyContactUpdateRequest,
  FamilyMemberCreateRequest,
  FamilyMemberUpdateRequest,
  RequestCreateRequest,
  RequestUpdateRequest,
} from "@/types/employee";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Employee APIs
export async function getEmployees(params?: {
  orderBy?: string;
  orderType?: "ASC" | "DESC";
  offset?: number;
  pageSize?: number;
  positionId?: number;
  firstName?: string;
  lastName?: string;
  areaId?: number;
  departmentId?: number;
  companyId?: number;
}): Promise<EmployeesResponse> {
  const searchParams = new URLSearchParams();
  if (params?.orderBy) searchParams.append("orderBy", params.orderBy);
  if (params?.orderType) searchParams.append("orderType", params.orderType);
  if (params?.offset !== undefined)
    searchParams.append("offset", params.offset.toString());
  if (params?.pageSize)
    searchParams.append("pageSize", params.pageSize.toString());
  if (params?.positionId)
    searchParams.append("positionId", params.positionId.toString());
  if (params?.firstName) searchParams.append("firstName", params.firstName);
  if (params?.lastName) searchParams.append("lastName", params.lastName);
  if (params?.areaId) searchParams.append("areaId", params.areaId.toString());
  if (params?.departmentId)
    searchParams.append("departmentId", params.departmentId.toString());
  if (params?.companyId)
    searchParams.append("companyId", params.companyId.toString());

  const response = await fetch(
    `${API_BASE_URL}/api/employees?${searchParams}`,
    {
      headers: getAuthHeaders(),
    },
  );
  if (!response.ok) throw new Error("Failed to fetch employees");
  return response.json();
}

export async function getEmployee(id: number): Promise<EmployeeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch employee");
  return response.json();
}

export async function createEmployee(
  data: EmployeeCreateRequest,
): Promise<EmployeeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/employees`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create employee");
  return response.json();
}

export async function updateEmployee(
  id: number,
  data: EmployeeUpdateRequest,
): Promise<EmployeeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update employee");
  return response.json();
}

export async function deleteEmployee(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete employee");
}

// Contract APIs
export async function createContract(
  data: ContractCreateRequest,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/contracts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create contract");
  return response.json();
}

export async function updateContract(
  id: number,
  data: ContractUpdateRequest,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/contracts/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update contract");
  return response.json();
}

export async function deleteContract(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/contracts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete contract");
}

// Health Record APIs
export async function createHealthRecord(
  data: HealthRecordCreateRequest,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/health`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create health record");
  return response.json();
}

export async function updateHealthRecord(
  id: number,
  data: HealthRecordUpdateRequest,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/health/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update health record");
  return response.json();
}

export async function deleteHealthRecord(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/health/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete health record");
}

// Evaluation APIs
export async function createEvaluation(
  data: EvaluationCreateRequest,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/evaluations`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create evaluation");
  return response.json();
}

export async function updateEvaluation(
  id: number,
  data: EvaluationUpdateRequest,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/evaluations/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update evaluation");
  return response.json();
}

export async function deleteEvaluation(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/evaluations/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete evaluation");
}

// Emergency Contact APIs
export async function createEmergencyContact(
  data: EmergencyContactCreateRequest,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/emergency-contacts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create emergency contact");
  return response.json();
}

export async function updateEmergencyContact(
  id: number,
  data: EmergencyContactUpdateRequest,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/emergency-contacts/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update emergency contact");
  return response.json();
}

export async function deleteEmergencyContact(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/emergency-contacts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete emergency contact");
}

// Family Member APIs
export async function createFamilyMember(
  data: FamilyMemberCreateRequest,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/family-members`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create family member");
  return response.json();
}

export async function updateFamilyMember(
  id: number,
  data: FamilyMemberUpdateRequest,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/family-members/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update family member");
  return response.json();
}

export async function deleteFamilyMember(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/family-members/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete family member");
}

// Request APIs
export async function createRequest(data: RequestCreateRequest): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/requests`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create request");
  return response.json();
}

export async function updateRequest(
  id: number,
  data: RequestUpdateRequest,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update request");
  return response.json();
}

export async function deleteRequest(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete request");
}
