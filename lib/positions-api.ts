import type {
  PositionCreateRequest,
  PositionUpdateRequest,
  PositionsResponse,
  PositionResponse,
} from "@/types/organizational-structure";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class PositionsAPI {
  private static getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  static async getPositions(
    params: {
      orderBy?: string;
      orderType?: "ASC" | "DESC";
      offset?: number;
      pageSize?: number;
      departmentId?: number;
      name?: string;
    } = {},
  ): Promise<PositionsResponse> {
    const {
      orderBy = "id",
      orderType = "DESC",
      offset = 0,
      pageSize = 10,
      departmentId,
      name,
    } = params;
    const queryParams = new URLSearchParams({
      orderBy,
      orderType,
      offset: offset.toString(),
      pageSize: pageSize.toString(),
    });

    if (departmentId) {
      queryParams.append("departmentId", departmentId.toString());
    }
    if (name) {
      queryParams.append("name", name);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/positions?${queryParams}`,
      {
        headers: this.getAuthHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch positions");
    }

    return response.json();
  }

  static async getPositionById(id: number): Promise<PositionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/positions/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch position");
    }

    return response.json();
  }

  static async createPosition(
    positionData: PositionCreateRequest,
  ): Promise<PositionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/positions`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(positionData),
    });

    if (!response.ok) {
      throw new Error("Failed to create position");
    }

    return response.json();
  }

  static async updatePosition(
    id: number,
    positionData: PositionUpdateRequest,
  ): Promise<PositionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/positions/${id}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(positionData),
    });

    if (!response.ok) {
      throw new Error("Failed to update position");
    }

    return response.json();
  }

  static async deletePosition(
    id: number,
  ): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/positions/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete position");
    }

    return response.json();
  }
}
