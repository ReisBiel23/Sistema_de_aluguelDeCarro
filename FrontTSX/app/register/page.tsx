import { registerAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Cadastro</CardTitle>
          <CardDescription>Crie sua conta para começar a alugar carros</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={registerAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" name="name" type="text" placeholder="João Silva" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+55 11 99999-9999" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" name="cpf" type="text" placeholder="123.456.789-00" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} />
            </div>
            <Button type="submit" className="w-full">
              Criar Conta
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link href="/login" className="underline hover:text-primary">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
