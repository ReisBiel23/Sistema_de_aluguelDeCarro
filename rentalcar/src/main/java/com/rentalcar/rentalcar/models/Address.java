package com.rentalcar.rentalcar.models;

import jakarta.persistence.*;

@Embeddable
public class Address {
    private String addressStreet;
    private Integer addressNumber;
    private String addressCity;
    private String addressState;
}
