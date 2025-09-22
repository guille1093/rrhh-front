"use client"
import { NavMain } from "@/components/nav-main"
import { Home, Users, Shield, Settings, Building, UserCheck, FileText } from "lucide-react"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/contexts/auth-context"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


// Navigation items from dashboard-nav, with permissions
const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    permissions: [],
  },
  {
    title: "Empleados",
    url: "/dashboard/employees",
    icon: UserCheck,
    permissions: ["read:employees"],
  },
  {
    title: "Compañías",
    url: "/dashboard/companies",
    icon: Building,
    permissions: ["read:companies"],
  },
  {
    title: "Reportes",
    url: "/dashboard/reports",
    icon: FileText,
    permissions: ["read:reports-employees-count"],
  },
  {
    title: "Configuración",
    url: "/dashboard/settings",
    icon: Settings,
    permissions: [],
    items: [
      {
        title: "Usuarios",
        url: "/dashboard/users",
        icon: Users,
        permissions: ["read:users"],
      },
      {
        title: "Roles y permisos",
        url: "/dashboard/roles",
        icon: Shield,
        permissions: ["read:roles"],
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, hasPermission } = useAuth()
  const pathname = usePathname()

  // Filter nav items by user permissions
  const filteredNavItems = navItems.filter((item) =>
    item.permissions.length === 0 || item.permissions.some((perm) => hasPermission(perm))
  ).map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }))
  // Compose user info for NavUser
  const userInfo = user
    ? {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatar: "/avatars/shadcn.jpg", // fallback, no avatar in user type
      }
    : { name: "", email: "", avatar: "" }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavItems || []} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
