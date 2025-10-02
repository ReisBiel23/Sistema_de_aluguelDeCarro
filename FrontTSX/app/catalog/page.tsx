import { Header } from "@/components/header"
import { CarCard } from "@/components/car-card"
import { getCars } from "@/lib/db"
import { CatalogFilters } from "@/components/catalog-filters"

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string
    transmission?: string
    minPrice?: string
    maxPrice?: string
    search?: string
  }>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const allCars = getCars()

  // Apply filters
  let filteredCars = allCars.filter((car) => car.available)

  if (params.category) {
    filteredCars = filteredCars.filter((car) => car.category === params.category)
  }

  if (params.transmission) {
    filteredCars = filteredCars.filter((car) => car.transmission === params.transmission)
  }

  if (params.minPrice) {
    filteredCars = filteredCars.filter((car) => car.pricePerDay >= Number(params.minPrice))
  }

  if (params.maxPrice) {
    filteredCars = filteredCars.filter((car) => car.pricePerDay <= Number(params.maxPrice))
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase()
    filteredCars = filteredCars.filter(
      (car) =>
        car.brand.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        car.category.toLowerCase().includes(searchLower),
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Catálogo de Carros</h1>
            <p className="text-muted-foreground">
              Encontrados {filteredCars.length} {filteredCars.length === 1 ? "carro" : "carros"} disponíveis
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <CatalogFilters />
            </aside>

            <div className="lg:col-span-3">
              {filteredCars.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">Nenhum carro encontrado com os filtros selecionados.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              )}
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
