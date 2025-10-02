"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Edit, Trash2 } from "lucide-react"
import type { User } from "@/lib/types"

interface UsersManagementProps {
  users: User[]
}

export function UsersManagement({ users }: UsersManagementProps) {
  const [usersList] = useState(users)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {usersList.map((user) => (
            <div key={user.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{user.name}</h3>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role === "admin" ? "Admin" : "Cliente"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">CPF: {user.cpf}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={user.role === "admin"}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground pt-3 border-t">
                Cadastrado em: {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
