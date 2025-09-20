import type { LoginRequest, LoginResponse, AuthError } from "@/types/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error: AuthError = await response.json()
    throw new Error(error.message || "Login failed")
  }

  return response.json()
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("access_token", token)
}

export function removeStoredToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("access_token")
  localStorage.removeItem("user_data")
}

export function getStoredUser() {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem("user_data")
  return userData ? JSON.parse(userData) : null
}

export function setStoredUser(user: any): void {
  if (typeof window === "undefined") return
  localStorage.setItem("user_data", JSON.stringify(user))
}
