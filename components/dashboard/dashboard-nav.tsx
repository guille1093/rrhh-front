"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Users, Shield, Settings, Building, UserCheck, FileText } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    permissions: [],
  },
  {
    title: "Usuarios",
    href: "/dashboard/users",
    icon: Users,
    permissions: ["read:users"],
  },
  {
    title: "Roles",
    href: "/dashboard/roles",
    icon: Shield,
    permissions: ["read:roles"],
  },
  {
    title: "Empleados",
    href: "/dashboard/employees",
    icon: UserCheck,
    permissions: ["read:employees"],
  },
  {
    title: "Compañías",
    href: "/dashboard/companies",
    icon: Building,
    permissions: ["read:companies"],
  },
  {
    title: "Reportes",
    href: "/dashboard/reports",
    icon: FileText,
    permissions: ["read:reports-employees-count"],
  },
  {
    title: "Configuración",
    href: "/dashboard/settings",
    icon: Settings,
    permissions: [],
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive && "bg-secondary")}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.title}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
