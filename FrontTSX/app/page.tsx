import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { SearchForm } from "@/components/search-form"
import Link from "next/link"
import { Car, Shield, Clock, CreditCard } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/20 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Alugue o carro perfeito para sua viagem
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Encontre os melhores carros com preços competitivos. Reserva rápida, fácil e segura.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/catalog">Ver Catálogo</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">Criar Conta</Link>
                </Button>
              </div>
            </div>

            <div className="lg:pl-8">
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher a CarRental?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Oferecemos a melhor experiência em aluguel de carros com benefícios exclusivos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Ampla Variedade</h3>
              <p className="text-sm text-muted-foreground">Diversos modelos de carros para atender suas necessidades</p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Preços Competitivos</h3>
              <p className="text-sm text-muted-foreground">Melhores tarifas do mercado sem taxas ocultas</p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Reserva Rápida</h3>
              <p className="text-sm text-muted-foreground">Reserve seu carro em poucos minutos online</p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Seguro e Confiável</h3>
              <p className="text-sm text-muted-foreground">Todos os carros com seguro completo incluído</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Pronto para começar sua jornada?</h2>
          <p className="text-lg opacity-90">Cadastre-se agora e aproveite ofertas exclusivas no seu primeiro aluguel</p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/register">Criar Conta Grátis</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-muted/30">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CarRental. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
