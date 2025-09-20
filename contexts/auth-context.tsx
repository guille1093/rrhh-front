"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, LoginRequest } from "@/types/auth"
import { loginUser, getStoredToken, setStoredToken, removeStoredToken, getStoredUser, setStoredUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = getStoredToken()
    const userData = getStoredUser()

    if (token && userData) {
      setUser(userData)
    }

    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      const response = await loginUser(credentials)

      setStoredToken(response.access_token)
      setStoredUser(response.user)
      setUser(response.user)

      router.push("/dashboard")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    removeStoredToken()
    setUser(null)
    router.push("/login")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user?.role?.permissions) return false
    return user.role.permissions.some((p) => p.permission === permission)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
