"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"

export function SearchForm() {
  const router = useRouter()
  const [pickupLocation, setPickupLocation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (pickupLocation) params.set("location", pickupLocation)
    if (startDate) params.set("startDate", startDate)
    if (endDate) params.set("endDate", endDate)
    router.push(`/catalog?${params.toString()}`)
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Local de Retirada
          </Label>
          <Input
            id="location"
            placeholder="Ex: Aeroporto de Guarulhos"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg">
          Buscar Carros Disponíveis
        </Button>
      </form>
    </Card>
  )
}
