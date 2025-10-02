import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { getAuthCookie } from "@/lib/auth"
import { getReservationsByUserId, getCarById } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Car, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function DashboardPage() {
  const user = await getAuthCookie()

  if (!user) {
    redirect("/login")
  }

  if (user.role === "admin") {
    redirect("/admin")
  }

  const reservations = getReservationsByUserId(user.id)

  // Separate reservations by status
  const activeReservations = reservations.filter((r) => r.status === "confirmed" || r.status === "pending")
  const pastReservations = reservations.filter((r) => r.status === "completed" || r.status === "cancelled")

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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Olá, {user.name}!</h1>
            <p className="text-muted-foreground">Gerencie suas reservas e histórico de aluguéis</p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activeReservations.length}</p>
                    <p className="text-sm text-muted-foreground">Reservas Ativas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pastReservations.length}</p>
                    <p className="text-sm text-muted-foreground">Histórico</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{reservations.length}</p>
                    <p className="text-sm text-muted-foreground">Total de Reservas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Reservations */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Reservas Ativas</h2>
              <Button asChild>
                <Link href="/catalog">Nova Reserva</Link>
              </Button>
            </div>

            {activeReservations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Você não tem reservas ativas no momento</p>
                  <Button asChild>
                    <Link href="/catalog">Explorar Carros</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeReservations.map((reservation) => {
                  const car = getCarById(reservation.carId)
                  if (!car) return null

                  const startDate = new Date(reservation.startDate).toLocaleDateString("pt-BR")
                  const endDate = new Date(reservation.endDate).toLocaleDateString("pt-BR")
                  const statusInfo = getStatusBadge(reservation.status)

                  return (
                    <Card key={reservation.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={car.image || "/placeholder.svg"}
                              alt={`${car.brand} ${car.model}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 192px"
                            />
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-bold text-xl">
                                  {car.brand} {car.model}
                                </h3>
                                <p className="text-sm text-muted-foreground">{car.year}</p>
                              </div>
                              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {startDate} - {endDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{reservation.pickupLocation}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <div>
                                <p className="text-sm text-muted-foreground">Valor Total</p>
                                <p className="text-xl font-bold">R$ {reservation.totalPrice}</p>
                              </div>
                              <Button asChild variant="outline">
                                <Link href={`/reservation/${reservation.id}`}>Ver Detalhes</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Past Reservations */}
          {pastReservations.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Histórico</h2>
              <div className="space-y-4">
                {pastReservations.map((reservation) => {
                  const car = getCarById(reservation.carId)
                  if (!car) return null

                  const startDate = new Date(reservation.startDate).toLocaleDateString("pt-BR")
                  const endDate = new Date(reservation.endDate).toLocaleDateString("pt-BR")
                  const statusInfo = getStatusBadge(reservation.status)

                  return (
                    <Card key={reservation.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={car.image || "/placeholder.svg"}
                              alt={`${car.brand} ${car.model}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 192px"
                            />
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-bold text-xl">
                                  {car.brand} {car.model}
                                </h3>
                                <p className="text-sm text-muted-foreground">{car.year}</p>
                              </div>
                              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {startDate} - {endDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{reservation.pickupLocation}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <div>
                                <p className="text-sm text-muted-foreground">Valor Total</p>
                                <p className="text-xl font-bold">R$ {reservation.totalPrice}</p>
                              </div>
                              <Button asChild variant="outline">
                                <Link href={`/reservation/${reservation.id}`}>Ver Detalhes</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
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
