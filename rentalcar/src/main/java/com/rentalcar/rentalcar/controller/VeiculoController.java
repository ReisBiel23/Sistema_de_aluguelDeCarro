package com.rentalcar.rentalcar.controller;

import com.rentalcar.rentalcar.models.entities.Veiculo;
import com.rentalcar.rentalcar.service.VeiculoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    private VeiculoService veiculoService;

    public VeiculoController(VeiculoService service) {
        this.veiculoService = service;
    }

    @GetMapping("/veiculo/all")
    public List<Veiculo> getAllVeiculos() {
        return veiculoService.findAllVeiculos();
    }

    @GetMapping("/veiculo/{id}")
    public Veiculo getVeiculoById(@PathVariable Long id) {
        return veiculoService.buscarPorId(id);
    }

    @PostMapping("/veiculo")
    public Veiculo createVeiculo(@RequestBody Veiculo veiculo) {
        return veiculoService.createVeiculo(veiculo);
    }

    @PutMapping("/veiculo/{id}")
    public Veiculo updateVeiculo(@PathVariable Long id, @RequestBody Veiculo veiculo) {
        return veiculoService.updateVeiculo(id, veiculo);
    }

    @DeleteMapping("/veiculo/{id}")
    public void deletVeiculo(@PathVariable Long id) {
        veiculoService.deleteVeiculo(id);
    }
}