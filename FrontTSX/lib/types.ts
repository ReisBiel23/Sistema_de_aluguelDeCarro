export interface Car {
  id: string
  brand: string
  model: string
  year: number
  category: string
  transmission: string
  seats: number
  pricePerDay: number
  image: string
  features: string[]
  available: boolean
  fuelType: string
  mileage: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "client"
  phone: string
  cpf: string
  createdAt: string
}

export interface Reservation {
  id: string
  userId: string
  carId: string
  startDate: string
  endDate: string
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  pickupLocation: string
  returnLocation: string
  createdAt: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: "admin" | "client"
}
