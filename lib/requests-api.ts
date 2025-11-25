import type { Employee } from "@/types/employee";

export interface Request {
  id: number;
  employee: Employee;
  type: string;
  period: string | null;
  absenceType: string | null;
  startDate: string | null;
  endDate: string | null;
  returnDate: string | null;
  notifiedAt: string | null;
  daysCorresponding: number | null;
  daysTaken: number | null;
  daysAvailable: number | null;
  daysRequested: number | null;
  description: string | null;
  justificationFileUrl: string | null;
  date: string | null;
  status: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getPendingRequests(): Promise<Request[]> {
  const response = await fetch(`${API_BASE_URL}/api/requests`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pending requests");
  }

  return response.json();
}
