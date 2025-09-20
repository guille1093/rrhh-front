import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/login", "/"]

  // Si es una ruta pública, permitir acceso
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Para rutas protegidas, verificar token en el cliente
  // El middleware no puede acceder a localStorage, así que redirigimos
  // y dejamos que el componente cliente maneje la verificación
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
