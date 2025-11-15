import type {
  AreaCreateRequest,
  AreaUpdateRequest,
  AreasResponse,
  AreaResponse,
} from "@/types/organizational-structure";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class AreasAPI {
  private static getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  static async getAreas(
    params: {
      orderBy?: string;
      orderType?: "ASC" | "DESC";
      offset?: number;
      pageSize?: number;
      companyId?: number;
      name?: string;
    } = {},
  ): Promise<AreasResponse> {
    const {
      orderBy = "id",
      orderType = "DESC",
      offset = 0,
      pageSize = 10,
      companyId,
      name,
    } = params;
    const queryParams = new URLSearchParams({
      orderBy,
      orderType,
      offset: offset.toString(),
      pageSize: pageSize.toString(),
    });

    if (companyId) {
      queryParams.append("companyId", companyId.toString());
    }
    if (name) {
      queryParams.append("name", name);
    }

    const response = await fetch(`${API_BASE_URL}/api/areas?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch areas");
    }

    return response.json();
  }

  static async getAreaById(id: number): Promise<AreaResponse> {
    const response = await fetch(`${API_BASE_URL}/api/areas/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch area");
    }

    return response.json();
  }

  static async createArea(areaData: AreaCreateRequest): Promise<AreaResponse> {
    const response = await fetch(`${API_BASE_URL}/api/areas`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(areaData),
    });

    if (!response.ok) {
      throw new Error("Failed to create area");
    }

    return response.json();
  }

  static async updateArea(
    id: number,
    areaData: AreaUpdateRequest,
  ): Promise<AreaResponse> {
    const response = await fetch(`${API_BASE_URL}/api/areas/${id}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(areaData),
    });

    if (!response.ok) {
      throw new Error("Failed to update area");
    }

    return response.json();
  }

  static async deleteArea(
    id: number,
  ): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/areas/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete area");
    }

    return response.json();
  }
}
