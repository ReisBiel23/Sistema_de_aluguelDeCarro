package com.rentalcar.rentalcar.service;

import com.rentalcar.rentalcar.domain.validations.ClientValidations;
import com.rentalcar.rentalcar.models.*;
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

    public Optional<Client> findClientById(Long id){
        return clientRepository.findById(id);
    }

    public Client createClient(Client client) {
        return clientRepository.save(client);
    }

    @Transactional
    public Client updateClient(Client client){
        Optional<Client> existingClientOptional = Optional.ofNullable(clientRepository.findBySocialId(client.getSocialId()));

        if(existingClientOptional.isPresent()) {
            Client existingClient = existingClientOptional.get();
            existingClient.setName(client.getName());
            existingClient.setEmail(client.getEmail());
            existingClient.setSocialId(client.getSocialId());
            existingClient.setOccupation(client.getOccupation());
        }
        clientValidations.validate(client);
        return clientRepository.save(client);
    }

    public Client deleteClientById(String socialId) {
        Client client = clientRepository.findBySocialId(socialId);

        if(nonNull(client)) {
            clientRepository.delete(client);
        }
        return client;
    }
}
