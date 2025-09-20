export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: Role
}

export interface Role {
  id: number
  role: string
  description: string
  permissions: Permission[]
}

export interface Permission {
  id: number
  permission: string
  description: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface AuthError {
  message: string
  statusCode: number
}
