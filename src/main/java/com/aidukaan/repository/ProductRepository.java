package com.aidukaan.repository;

import com.aidukaan.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findByUserId(String userId);

    Optional<Product> findByIdAndUserId(String id, String userId);
}