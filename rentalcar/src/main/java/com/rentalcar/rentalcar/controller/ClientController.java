package com.rentalcar.rentalcar.controller;

import com.rentalcar.rentalcar.models.entities.Client;
import com.rentalcar.rentalcar.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/clients")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @GetMapping("/all")
    public List<Client> getAllClients(){
        return clientService.findAllClients();
    }

    @GetMapping("/client/{socialId}")
    public Client getClientById(@PathVariable("socialId") String socialId){
        Optional<Client> client = clientService.findClientBySocialId(socialId);
        return client.orElse(null);
    }

    @PostMapping("/client")
    public Client createClient(@RequestBody Client client){
        System.out.println("Recebido: " + client.getAddress());
        return clientService.createClient(client);
    }

    @PatchMapping("/update")
    public Client updateClient(@RequestBody Client client){
        return clientService.updateClient(client);
    }

    @DeleteMapping("/delete/{socialId}")
    public Client deleteClient(@PathVariable String socialId){
        return clientService.deleteClientById(socialId);
    }
}
