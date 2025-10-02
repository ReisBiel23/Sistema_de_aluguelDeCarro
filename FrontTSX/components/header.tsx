import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car, User, Calendar } from "lucide-react"
import { getAuthCookie } from "@/lib/auth"
import { UserMenu } from "./user-menu"

export async function Header() {
  const user = await getAuthCookie()

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Car className="h-6 w-6" />
          <span>CarRental</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
            Catálogo
          </Link>
          <Link href="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
            Como Funciona
          </Link>
          <Link href="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
            Contato
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === "admin" ? (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin">
                    <User className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard">
                    <Calendar className="h-4 w-4 mr-2" />
                    Reservas
                  </Link>
                </Button>
              )}
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Cadastrar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
