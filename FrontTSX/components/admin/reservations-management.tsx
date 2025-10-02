"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Reservation } from "@/lib/types"
import { getCarById, getUserById } from "@/lib/db"

interface ReservationsManagementProps {
  reservations: Reservation[]
}

export function ReservationsManagement({ reservations }: ReservationsManagementProps) {
  const [reservationsList] = useState(reservations)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pendente", variant: "secondary" },
      confirmed: { label: "Confirmada", variant: "default" },
      completed: { label: "Concluída", variant: "outline" },
      cancelled: { label: "Cancelada", variant: "destructive" },
    }
    return variants[status] || { label: status, variant: "outline" }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Reservas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reservationsList.map((reservation) => {
            const car = getCarById(reservation.carId)
            const user = getUserById(reservation.userId)
            const statusInfo = getStatusBadge(reservation.status)

            if (!car || !user) return null

            return (
              <div key={reservation.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">Cliente: {user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(reservation.startDate).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(reservation.endDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="font-bold">R$ {reservation.totalPrice}</p>
                  </div>
                  <Select defaultValue={reservation.status}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
