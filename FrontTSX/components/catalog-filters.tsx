"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

export function CatalogFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/catalog?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/catalog")
  }

  const hasFilters = Array.from(searchParams.keys()).length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <Input
            id="search"
            placeholder="Marca ou modelo..."
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            defaultValue={searchParams.get("category") || "All"}
            onValueChange={(value) => updateFilter("category", value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Todas</SelectItem>
              <SelectItem value="Compact">Compacto</SelectItem>
              <SelectItem value="Sedan">Sedan</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission">Transmissão</Label>
          <Select
            defaultValue={searchParams.get("transmission") || "All"}
            onValueChange={(value) => updateFilter("transmission", value)}
          >
            <SelectTrigger id="transmission">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Todas</SelectItem>
              <SelectItem value="Automatic">Automático</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Preço por Dia</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Mín"
              defaultValue={searchParams.get("minPrice") || ""}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máx"
              defaultValue={searchParams.get("maxPrice") || ""}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
