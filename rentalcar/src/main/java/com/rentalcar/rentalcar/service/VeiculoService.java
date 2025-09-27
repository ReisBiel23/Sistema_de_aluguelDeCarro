package com.rentalcar.rentalcar.service;

import com.rentalcar.rentalcar.models.entities.Veiculo;
import com.rentalcar.rentalcar.repositories.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VeiculoService {

    @Autowired
    private VeiculoRepository veiculoRepository;

    public List<Veiculo> findAllVeiculos() {
        return veiculoRepository.findAll();
    }

    public Veiculo buscarPorId(Long id) {
        return veiculoRepository.findById(id).orElseThrow(() -> new RuntimeException("Veículo não encontrado"));
    }

    public Veiculo createVeiculo(Veiculo veiculo) {
        return veiculoRepository.save(veiculo);
    }

    public Veiculo updateVeiculo(Long id, Veiculo veiculo) {
        Veiculo existente = buscarPorId(id);
        existente.setMarca(veiculo.getMarca());
        existente.setModelo(veiculo.getModelo());
        existente.setPlaca(veiculo.getPlaca());
        existente.setAno(veiculo.getAno());
        existente.setDisponivel(veiculo.isDisponivel());
        return veiculoRepository.save(existente);
    }

    public void deleteVeiculo(Long id) {
        veiculoRepository.deleteById(id);
    }
}