import type { Car, User, Reservation } from "./types"
import carsData from "@/data/cars.json"
import usersData from "@/data/users.json"
import reservationsData from "@/data/reservations.json"

// In-memory database simulation
const cars: Car[] = [...carsData]
const users: User[] = [...usersData]
const reservations: Reservation[] = [...reservationsData]

// Cars
export function getCars(): Car[] {
  return cars
}

export function getCarById(id: string): Car | undefined {
  return cars.find((car) => car.id === id)
}

export function updateCar(id: string, data: Partial<Car>): Car | undefined {
  const index = cars.findIndex((car) => car.id === id)
  if (index === -1) return undefined

  cars[index] = { ...cars[index], ...data }
  return cars[index]
}

export function createCar(car: Omit<Car, "id">): Car {
  const newCar: Car = {
    ...car,
    id: String(Date.now()),
  }
  cars.push(newCar)
  return newCar
}

export function deleteCar(id: string): boolean {
  const index = cars.findIndex((car) => car.id === id)
  if (index === -1) return false

  cars.splice(index, 1)
  return true
}

// Users
export function getUsers(): User[] {
  return users
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email)
}

export function createUser(user: Omit<User, "id" | "createdAt">): User {
  const newUser: User = {
    ...user,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  return newUser
}

export function updateUser(id: string, data: Partial<User>): User | undefined {
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) return undefined

  users[index] = { ...users[index], ...data }
  return users[index]
}

export function deleteUser(id: string): boolean {
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) return false

  users.splice(index, 1)
  return true
}

// Reservations
export function getReservations(): Reservation[] {
  return reservations
}

export function getReservationById(id: string): Reservation | undefined {
  return reservations.find((reservation) => reservation.id === id)
}

export function getReservationsByUserId(userId: string): Reservation[] {
  return reservations.filter((reservation) => reservation.userId === userId)
}

export function getReservationsByCarId(carId: string): Reservation[] {
  return reservations.filter((reservation) => reservation.carId === carId)
}

export function createReservation(reservation: Omit<Reservation, "id" | "createdAt">): Reservation {
  const newReservation: Reservation = {
    ...reservation,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  }
  reservations.push(newReservation)
  return newReservation
}

export function updateReservation(id: string, data: Partial<Reservation>): Reservation | undefined {
  const index = reservations.findIndex((reservation) => reservation.id === id)
  if (index === -1) return undefined

  reservations[index] = { ...reservations[index], ...data }
  return reservations[index]
}

export function deleteReservation(id: string): boolean {
  const index = reservations.findIndex((reservation) => reservation.id === id)
  if (index === -1) return false

  reservations.splice(index, 1)
  return true
}

// Helper function to check car availability
export function isCarAvailable(carId: string, startDate: string, endDate: string): boolean {
  const carReservations = getReservationsByCarId(carId)

  const start = new Date(startDate)
  const end = new Date(endDate)

  return !carReservations.some((reservation) => {
    if (reservation.status === "cancelled") return false

    const resStart = new Date(reservation.startDate)
    const resEnd = new Date(reservation.endDate)

    return start <= resEnd && end >= resStart
  })
}
