package com.rentalcar.rentalcar.repositories;


import com.rentalcar.rentalcar.models.entities.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
}
