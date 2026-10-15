package com.aidukaan.service;

import com.aidukaan.model.Product;
import com.aidukaan.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(Product product, String userId) {

        product.setUserId(userId);

        return productRepository.save(product);
    }

    public List<Product> getAllProducts(String userId) {

        return productRepository.findByUserId(userId);
    }

    public Optional<Product> getProductById(String id, String userId) {

        return productRepository.findByIdAndUserId(id, userId);
    }

    public Product updateProduct(String id,
                                 Product product,
                                 String userId) {

        Product existingProduct =
                productRepository.findByIdAndUserId(id, userId)
                        .orElseThrow(() ->
                                new RuntimeException("उत्पाद नहीं मिला"));

        existingProduct.setName(product.getName());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setPurchasePrice(product.getPurchasePrice());
        existingProduct.setSellingPrice(product.getSellingPrice());
        existingProduct.setStock(product.getStock());

        return productRepository.save(existingProduct);
    }

    public void deleteProduct(String id, String userId) {

        Product product =
                productRepository.findByIdAndUserId(id, userId)
                        .orElseThrow(() ->
                                new RuntimeException("उत्पाद नहीं मिला"));

        productRepository.delete(product);
    }
}