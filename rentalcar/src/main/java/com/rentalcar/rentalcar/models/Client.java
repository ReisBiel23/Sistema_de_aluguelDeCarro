package com.rentalcar.rentalcar.models;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "client")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clientId;

    private String name;
    private String socialId;
    private String occupation;
    private String email;

    @Embedded
    private Address address;

}
