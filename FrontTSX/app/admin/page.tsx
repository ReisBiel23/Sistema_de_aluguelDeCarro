import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { getAuthCookie } from "@/lib/auth"
import { getCars, getUsers, getReservations } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Users, Calendar, DollarSign } from "lucide-react"
import { CarsManagement } from "@/components/admin/cars-management"
import { UsersManagement } from "@/components/admin/users-management"
import { ReservationsManagement } from "@/components/admin/reservations-management"

export default async function AdminPage() {
  const user = await getAuthCookie()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  const cars = getCars()
  const users = getUsers()
  const reservations = getReservations()

  const totalRevenue = reservations
    .filter((r) => r.status === "confirmed" || r.status === "completed")
    .reduce((sum, r) => sum + r.totalPrice, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie carros, clientes e reservas</p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{cars.length}</p>
                    <p className="text-sm text-muted-foreground">Total de Carros</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{users.filter((u) => u.role === "client").length}</p>
                    <p className="text-sm text-muted-foreground">Clientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{reservations.length}</p>
                    <p className="text-sm text-muted-foreground">Reservas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">R$ {totalRevenue}</p>
                    <p className="text-sm text-muted-foreground">Receita Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="cars" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="cars">Carros</TabsTrigger>
              <TabsTrigger value="reservations">Reservas</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
            </TabsList>

            <TabsContent value="cars">
              <CarsManagement cars={cars} />
            </TabsContent>

            <TabsContent value="reservations">
              <ReservationsManagement reservations={reservations} />
            </TabsContent>

            <TabsContent value="users">
              <UsersManagement users={users} />
            </TabsContent>
          </Tabs>
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
