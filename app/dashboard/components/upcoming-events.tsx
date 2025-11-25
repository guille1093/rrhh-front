"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, AlertCircle } from "lucide-react";

interface Event {
  fecha: string;
  nombre: string;
  tipo: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const today = new Date();
  const upcoming = events
    .filter((e) => new Date(e.fecha) >= today)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 5);

  if (!upcoming.length) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            No hay eventos próximos
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Próximos Eventos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {upcoming.map((event) => (
            <div
              key={event.fecha + event.nombre}
              className="p-3 border rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{event.nombre}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.tipo}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(event.fecha).toLocaleDateString("es-AR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
