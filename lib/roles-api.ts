import type {
  RoleCreateRequest,
  RoleUpdateRequest,
  RolesResponse,
  RoleResponse,
  PermissionsResponse,
} from "@/types/roles"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export class RolesAPI {
  private static getAuthHeaders() {
    const token = localStorage.getItem("access_token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  static async getRoles(
    params: {
      orderBy?: string
      orderType?: "ASC" | "DESC"
      offset?: number
      pageSize?: number
    } = {},
  ): Promise<RolesResponse> {
    const { orderBy = "id", orderType = "ASC", offset = 0, pageSize = 7 } = params
    const queryParams = new URLSearchParams({
      orderBy,
      orderType,
      offset: offset.toString(),
      pageSize: pageSize.toString(),
    })

    const response = await fetch(`${API_BASE_URL}/api/roles?${queryParams}`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch roles")
    }

    return response.json()
  }

  static async getRoleById(id: number): Promise<RoleResponse> {
    const response = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch role")
    }

    return response.json()
  }

  static async createRole(roleData: RoleCreateRequest): Promise<RoleResponse> {
    const response = await fetch(`${API_BASE_URL}/api/roles`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(roleData),
    })

    if (!response.ok) {
      throw new Error("Failed to create role")
    }

    return response.json()
  }

  static async updateRole(id: number, roleData: RoleUpdateRequest): Promise<RoleResponse> {
    const response = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(roleData),
    })

    if (!response.ok) {
      throw new Error("Failed to update role")
    }

    return response.json()
  }

  static async deleteRole(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to delete role")
    }
  }

  static async getAllPermissions(): Promise<PermissionsResponse> {
    const response = await fetch(`${API_BASE_URL}/api/roles/permissions`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch permissions")
    }

    return response.json()
  }
}
