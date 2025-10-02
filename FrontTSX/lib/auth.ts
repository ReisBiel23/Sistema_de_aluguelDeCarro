import { cookies } from "next/headers"
import type { AuthUser } from "./types"

const AUTH_COOKIE = "car-rental-auth"

export async function setAuthCookie(user: AuthUser) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function getAuthCookie(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(AUTH_COOKIE)

  if (!authCookie) {
    return null
  }

  try {
    return JSON.parse(authCookie.value)
  } catch {
    return null
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthCookie()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return user
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth()

  if (user.role !== "admin") {
    throw new Error("Forbidden")
  }

  return user
}
