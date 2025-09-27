package com.rentalcar.rentalcar.service;

import com.rentalcar.rentalcar.domain.validations.ClientValidations;
import com.rentalcar.rentalcar.models.entities.Client;
import com.rentalcar.rentalcar.repositories.ClientRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.util.Objects.nonNull;

@Service
public class ClientService {
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private ClientValidations clientValidations;


    public List<Client> findAllClients() {
        return clientRepository.findAll();
    }

    public Optional<Client> findClientBySocialId(String socialId){
        return Optional.ofNullable(clientRepository.findBySocialId(socialId));
    }

    public Client createClient(Client client) {
        return clientRepository.save(client);
    }

    @Transactional
    public Client updateClient(Client client) {
        Client existingClient = clientRepository.findBySocialId(client.getSocialId());

        if (existingClient == null) {
            throw new IllegalArgumentException("Cliente com CPF " + client.getSocialId() + " não encontrado.");
        }

        // Atualiza os campos
        existingClient.setName(client.getName());
        existingClient.setEmail(client.getEmail());
        existingClient.setOccupation(client.getOccupation());

        // Atualiza o endereço, se fornecido
        if (client.getAddress() != null) {
            existingClient.setAddress(client.getAddress());
        }

        clientValidations.validate(existingClient);
        return clientRepository.save(existingClient);
    }

    public Client deleteClientById(String socialId) {
        Client client = clientRepository.findBySocialId(socialId);

        if(nonNull(client)) {
            clientRepository.delete(client);
        }
        return client;
    }
}
