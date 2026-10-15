package com.aidukaan.controller;

import com.aidukaan.model.Product;
import com.aidukaan.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public Product addProduct(
            @RequestBody Product product,
            java.security.Principal principal) {

        String userId = principal.getName();

        return productService.addProduct(product, userId);
    }

    @GetMapping
    public List<Product> getAllProducts(
            java.security.Principal principal) {

        String userId = principal.getName();

        return productService.getAllProducts(userId);
    }

    @GetMapping("/{id}")
    public Product getProductById(
            @PathVariable String id,
            java.security.Principal principal) {

        String userId = principal.getName();

        return productService.getProductById(id, userId)
                .orElseThrow(() ->
                        new RuntimeException("उत्पाद नहीं मिला"));
    }

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable String id,
            @RequestBody Product product,
            java.security.Principal principal) {

        String userId = principal.getName();

        return productService.updateProduct(
                id,
                product,
                userId
        );
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(
            @PathVariable String id,
            java.security.Principal principal) {

        String userId = principal.getName();

        productService.deleteProduct(id, userId);

        return "Product deleted successfully";
    }
}