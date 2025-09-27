package com.rentalcar.rentalcar.models.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Embeddable
public class Address {
    private String addressStreet;
    private Integer addressNumber;
    private String addressCity;
    private String addressState;
}