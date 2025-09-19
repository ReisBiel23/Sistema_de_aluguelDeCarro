package com.rentalcar.rentalcar.domain.validations;

import com.rentalcar.rentalcar.models.Client;
import org.springframework.stereotype.Component;

@Component
public class ClientValidations {
    public void validate(Client client){
        if(client.getName() != null) {
            client.setName(client.getName());
        }
        if(client.getEmail() != null) {
            client.setEmail(client.getEmail());
        }
        if(client.getAddress() != null) {
            client.setAddress(client.getAddress());
        }
    }
}
