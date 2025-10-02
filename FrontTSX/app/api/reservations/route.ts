import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createReservation, isCarAvailable } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    const { carId, startDate, endDate, pickupLocation, returnLocation, totalPrice } = body

    if (!carId || !startDate || !endDate || !pickupLocation || !returnLocation) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Check if car is available
    if (!isCarAvailable(carId, startDate, endDate)) {
      return NextResponse.json({ error: "Carro não disponível para as datas selecionadas" }, { status: 400 })
    }

    const reservation = createReservation({
      userId: user.id,
      carId,
      startDate,
      endDate,
      pickupLocation,
      returnLocation,
      totalPrice,
      status: "pending",
    })

    return NextResponse.json({ reservation }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }
    return NextResponse.json({ error: "Erro ao criar reserva" }, { status: 500 })
  }
}
