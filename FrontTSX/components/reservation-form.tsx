"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Car, AuthUser } from "@/lib/types"

interface ReservationFormProps {
  car: Car
  user: AuthUser | null
}

export function ReservationForm({ car, user }: ReservationFormProps) {
  const router = useRouter()
  const [pickupLocation, setPickupLocation] = useState("")
  const [returnLocation, setReturnLocation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const days = calculateDays()
  const totalPrice = days * car.pricePerDay

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!user) {
      router.push("/login")
      return
    }

    if (!pickupLocation || !returnLocation || !startDate || !endDate) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError("A data de devolução deve ser posterior à data de retirada")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          startDate,
          endDate,
          pickupLocation,
          returnLocation,
          totalPrice,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro ao criar reserva")
        setIsSubmitting(false)
        return
      }

      router.push(`/reservation/${data.reservation.id}`)
    } catch (err) {
      setError("Erro ao processar reserva")
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fazer Reserva</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pickupLocation" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Local de Retirada
            </Label>
            <Input
              id="pickupLocation"
              placeholder="Ex: Aeroporto de Guarulhos"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnLocation" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Local de Devolução
            </Label>
            <Input
              id="returnLocation"
              placeholder="Ex: Aeroporto de Guarulhos"
              value={returnLocation}
              onChange={(e) => setReturnLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data de Retirada
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data de Devolução
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {days > 0 && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Diárias ({days} dias)</span>
                <span className="font-medium">
                  R$ {car.pricePerDay} x {days}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>R$ {totalPrice}</span>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Processando..." : user ? "Confirmar Reserva" : "Fazer Login para Reservar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
