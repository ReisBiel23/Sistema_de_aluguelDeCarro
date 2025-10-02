import { notFound, redirect } from "next/navigation"
import { Header } from "@/components/header"
import { getReservationById, getCarById } from "@/lib/db"
import { getAuthCookie } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, MapPin, Car, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ReservationPageProps {
  params: Promise<{ id: string }>
}

export default async function ReservationPage({ params }: ReservationPageProps) {
  const { id } = await params
  const user = await getAuthCookie()

  if (!user) {
    redirect("/login")
  }

  const reservation = getReservationById(id)

  if (!reservation) {
    notFound()
  }

  // Check if user owns this reservation or is admin
  if (reservation.userId !== user.id && user.role !== "admin") {
    redirect("/dashboard")
  }

  const car = getCarById(reservation.carId)

  if (!car) {
    notFound()
  }

  const startDate = new Date(reservation.startDate).toLocaleDateString("pt-BR")
  const endDate = new Date(reservation.endDate).toLocaleDateString("pt-BR")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Reserva Confirmada!</h1>
            <p className="text-muted-foreground">Sua reserva foi criada com sucesso</p>
          </div>

          {/* Reservation Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Detalhes da Reserva</CardTitle>
                  <Badge>{reservation.status === "pending" ? "Pendente" : "Confirmada"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Período</p>
                    <p className="text-sm text-muted-foreground">
                      {startDate} até {endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Locais</p>
                    <p className="text-sm text-muted-foreground">Retirada: {reservation.pickupLocation}</p>
                    <p className="text-sm text-muted-foreground">Devolução: {reservation.returnLocation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Valor Total</p>
                    <p className="text-2xl font-bold">R$ {reservation.totalPrice}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Car Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Veículo Reservado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={car.image || "/placeholder.svg"}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">{car.year}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {car.seats} passageiros • {car.transmission} • {car.fuelType}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Simulation */}
            <Card>
              <CardHeader>
                <CardTitle>Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Simulação de Pagamento</p>
                  <p className="font-medium">O pagamento será processado na retirada do veículo</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href="/dashboard">Ver Minhas Reservas</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/catalog">Fazer Nova Reserva</Link>
              </Button>
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
