"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Request {
  id: number;
  employee: {
    id: number;
    firstName: string;
    lastName: string;
  };
  type: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface PendingRequestsProps {
  requests: Request[];
}

export function PendingRequests({ requests }: PendingRequestsProps) {
  const router = useRouter();

  if (!requests.length) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Solicitudes Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            No hay solicitudes pendientes
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Solicitudes Pendientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
              onClick={() =>
                router.push(
                  `/dashboard/employees/${request.employee.id}/profile?tab=requests`,
                )
              }
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">
                    {request.employee.firstName} {request.employee.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {request.type}
                  </p>
                </div>
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded">
                  Pendiente
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(request.startDate).toLocaleDateString("es-AR")} -{" "}
                {new Date(request.endDate).toLocaleDateString("es-AR")}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
