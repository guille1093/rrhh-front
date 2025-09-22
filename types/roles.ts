export interface Permission {
  id: number
  permission: string
  description: string
}

export interface Role {
  id: number
  role: string
  description: string
  permissions: Permission[]
}

export interface RoleCreateRequest {
  role: string
  description: string
  permissions: number[]
}

export interface RoleUpdateRequest {
  role: string
  permissions: number[]
}

export interface RolesResponse {
  status: string
  data: {
    total: number
    pageSize: number
    offset: number
    results: Role[]
  }
}

export interface RoleResponse {
  status: string
  data: Role
}

export interface PermissionsResponse {
  status: string
  data: Permission[]
}
