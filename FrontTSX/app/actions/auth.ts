"use server"

import { redirect } from "next/navigation"
import { getUserByEmail, createUser } from "@/lib/db"
import { setAuthCookie, clearAuthCookie } from "@/lib/auth"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  const user = getUserByEmail(email)

  if (!user || user.password !== password) {
    return { error: "Email ou senha inválidos" }
  }

  await setAuthCookie({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })

  if (user.role === "admin") {
    redirect("/admin")
  } else {
    redirect("/dashboard")
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const phone = formData.get("phone") as string
  const cpf = formData.get("cpf") as string

  if (!name || !email || !password || !phone || !cpf) {
    return { error: "Todos os campos são obrigatórios" }
  }

  const existingUser = getUserByEmail(email)

  if (existingUser) {
    return { error: "Email já cadastrado" }
  }

  const newUser = createUser({
    name,
    email,
    password,
    phone,
    cpf,
    role: "client",
  })

  await setAuthCookie({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  })

  redirect("/dashboard")
}

export async function logoutAction() {
  await clearAuthCookie()
  redirect("/")
}
