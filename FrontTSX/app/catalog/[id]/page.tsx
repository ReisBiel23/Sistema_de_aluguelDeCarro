import { notFound } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { getCarById } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Fuel, Gauge, Check } from "lucide-react"
import { ReservationForm } from "@/components/reservation-form"
import { getAuthCookie } from "@/lib/auth"

interface CarDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
  const { id } = await params
  const car = getCarById(id)
  const user = await getAuthCookie()

  if (!car) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Car Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <div className="relative h-96 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <Badge className="absolute top-4 right-4">{car.category}</Badge>
              </div>

              {/* Title and Price */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {car.brand} {car.model}
                </h1>
                <p className="text-muted-foreground mb-4">{car.year}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">R$ {car.pricePerDay}</span>
                  <span className="text-muted-foreground">/dia</span>
                </div>
              </div>

              {/* Specifications */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-bold text-xl mb-4">Especificações</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">Passageiros</span>
                      </div>
                      <p className="font-semibold">{car.seats} pessoas</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Gauge className="h-4 w-4" />
                        <span className="text-sm">Transmissão</span>
                      </div>
                      <p className="font-semibold">{car.transmission}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Fuel className="h-4 w-4" />
                        <span className="text-sm">Combustível</span>
                      </div>
                      <p className="font-semibold">{car.fuelType}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Gauge className="h-4 w-4" />
                        <span className="text-sm">Consumo</span>
                      </div>
                      <p className="font-semibold">{car.mileage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-bold text-xl mb-4">Recursos Incluídos</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {car.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reservation Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <ReservationForm car={car} user={user} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 px-4 border-t bg-muted/30">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CarRental. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
