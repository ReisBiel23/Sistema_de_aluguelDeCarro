"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Car } from "@/lib/types"
import Image from "next/image"

interface CarsManagementProps {
  cars: Car[]
}

export function CarsManagement({ cars }: CarsManagementProps) {
  const [carsList] = useState(cars)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gerenciar Carros</CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Carro
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {carsList.map((car) => (
            <div key={car.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="relative w-24 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">
                    {car.brand} {car.model}
                  </h3>
                  <Badge variant={car.available ? "default" : "secondary"}>
                    {car.available ? "Disponível" : "Indisponível"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {car.category} • {car.year} • R$ {car.pricePerDay}/dia
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
