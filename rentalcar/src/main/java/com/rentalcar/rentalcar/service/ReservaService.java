package com.rentalcar.rentalcar.service;

import com.rentalcar.rentalcar.models.entities.Reserva;
import com.rentalcar.rentalcar.repositories.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    public List<Reserva> findAllReservas() {
        return reservaRepository.findAll();
    }

    public Reserva FindReservaById(Long id) {
        return reservaRepository.findById(id).orElseThrow(() -> new RuntimeException("Reserva não encontrada"));
    }

    public Reserva createReserva(Reserva reserva) {
        return reservaRepository.save(reserva);
    }

    public Reserva updateReserva(Long id, Reserva reserva) {
        Reserva existente = FindReservaById(id);
        existente.setDataInicio(reserva.getDataInicio());
        existente.setDataFim(reserva.getDataFim());
        existente.setCliente(reserva.getCliente());
        existente.setVeiculo(reserva.getVeiculo());
        return reservaRepository.save(existente);
    }

    public void deleteReserva(Long id) {
        reservaRepository.deleteById(id);
    }
}
