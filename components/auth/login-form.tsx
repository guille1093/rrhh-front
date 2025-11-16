"use client";

import type React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Building2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // No limpiar error, usaremos toast

    try {
      await login({ email, password });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error de autenticación",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/*backgorund image */}
      <Image
        src="/bg.jpg"
        alt="Background Image"
        className="absolute inset-0 object-cover w-full h-full z-0"
        height={1920}
        width={1080}
      />
      <Card className="w-full max-w-md z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            <div>
              <div className="flex items-center gap-2">
                <p className=" ms-6s text-5xl text-teal-500 font-bold">
                  <strong className="text-purple-600">「</strong>
                  <strong className="text-teal-500">」</strong>
                  FLOW
                  <strong className="text-purple-600">HR</strong>
                </p>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingrese su correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña*</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {/* Los errores ahora se muestran con toast (sonner) */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
