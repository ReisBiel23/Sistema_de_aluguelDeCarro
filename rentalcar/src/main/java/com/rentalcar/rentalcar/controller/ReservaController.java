package com.rentalcar.rentalcar.controller;

import com.rentalcar.rentalcar.models.entities.Reserva;
import com.rentalcar.rentalcar.service.ReservaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    private ReservaService reservaService;

    public ReservaController(ReservaService service) {
        this.reservaService = service;
    }

    @GetMapping("/reserva/all")
    public List<Reserva> getAllReservas() {
        return reservaService.findAllReservas();
    }

    @GetMapping("/reserva/{id}")
    public Reserva getReservaById(@PathVariable Long id) {
        return reservaService.FindReservaById(id);
    }

    @PostMapping("/reserva")
    public Reserva createReserva(@RequestBody Reserva reserva) {
        return reservaService.createReserva(reserva);
    }

    @PutMapping("/reserva/{id}")
    public Reserva updateReserva(@PathVariable Long id, @RequestBody Reserva reserva) {
        return reservaService.updateReserva(id, reserva);
    }

    @DeleteMapping("/reserva/{id}")
    public void deleteReserva(@PathVariable Long id) {
        reservaService.deleteReserva(id);
    }
}
