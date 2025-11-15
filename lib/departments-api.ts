import type {
  DepartmentCreateRequest,
  DepartmentUpdateRequest,
  DepartmentsResponse,
  DepartmentResponse,
} from "@/types/organizational-structure";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class DepartmentsAPI {
  private static getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  static async getDepartments(
    params: {
      orderBy?: string;
      orderType?: "ASC" | "DESC";
      offset?: number;
      pageSize?: number;
      areaId?: number;
      name?: string;
    } = {},
  ): Promise<DepartmentsResponse> {
    const {
      orderBy = "id",
      orderType = "DESC",
      offset = 0,
      pageSize = 10,
      areaId,
      name,
    } = params;
    const queryParams = new URLSearchParams({
      orderBy,
      orderType,
      offset: offset.toString(),
      pageSize: pageSize.toString(),
    });

    if (areaId) {
      queryParams.append("areaId", areaId.toString());
    }
    if (name) {
      queryParams.append("name", name);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/departments?${queryParams}`,
      {
        headers: this.getAuthHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch departments");
    }

    return response.json();
  }

  static async getDepartmentById(id: number): Promise<DepartmentResponse> {
    const response = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch department");
    }

    return response.json();
  }

  static async createDepartment(
    departmentData: DepartmentCreateRequest,
  ): Promise<DepartmentResponse> {
    const response = await fetch(`${API_BASE_URL}/api/departments`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(departmentData),
    });

    if (!response.ok) {
      throw new Error("Failed to create department");
    }

    return response.json();
  }

  static async updateDepartment(
    id: number,
    departmentData: DepartmentUpdateRequest,
  ): Promise<DepartmentResponse> {
    const response = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(departmentData),
    });

    if (!response.ok) {
      throw new Error("Failed to update department");
    }

    return response.json();
  }

  static async deleteDepartment(
    id: number,
  ): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete department");
    }

    return response.json();
  }
}
