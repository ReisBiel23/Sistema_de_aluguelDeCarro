import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Fuel, Gauge } from "lucide-react"
import type { Car } from "@/lib/types"

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-muted">
        <Image
          src={car.image || "/placeholder.svg"}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Badge className="absolute top-3 right-3">{car.category}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">
          {car.brand} {car.model}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{car.year}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{car.seats}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" />
            <span>{car.fuelType}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">R$ {car.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">/dia</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/catalog/${car.id}`}>Ver Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
