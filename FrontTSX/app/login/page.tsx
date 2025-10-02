import { loginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <Link href="/register" className="underline hover:text-primary">
              Cadastre-se
            </Link>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">Contas de teste:</p>
            <p className="text-muted-foreground">
              <strong>Admin:</strong> admin@carrental.com / admin123
            </p>
            <p className="text-muted-foreground">
              <strong>Cliente:</strong> joao@email.com / senha123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
