package com.rentalcar.rentalcar.repositories;

import com.rentalcar.rentalcar.models.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Client findBySocialId(String socialId);
}
