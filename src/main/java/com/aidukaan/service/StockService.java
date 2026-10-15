package com.aidukaan.service;

import com.aidukaan.model.Stock;
import com.aidukaan.model.Product;
import com.aidukaan.repository.StockRepository;
import com.aidukaan.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final ProductRepository productRepository;

    public StockService(StockRepository stockRepository,
                        ProductRepository productRepository) {

        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
    }

    public Stock addStock(Stock stock) {

        Product product = productRepository.findById(stock.getProductId())
                .orElseThrow(() -> new RuntimeException("उत्पाद नहीं मिला"));

        if (stock.getType().equalsIgnoreCase("IN")) {

            product.setStock(
                    product.getStock() + stock.getQuantity()
            );

        } else if (stock.getType().equalsIgnoreCase("OUT")) {

            if (product.getStock() < stock.getQuantity()) {
                throw new RuntimeException("पर्याप्त स्टॉक उपलब्ध नहीं है");
            }

            product.setStock(
                    product.getStock() - stock.getQuantity()
            );
        }

        productRepository.save(product);

        return stockRepository.save(stock);
    }

    public List<Stock> getAllStock() {
        return stockRepository.findAll();
    }

    public Optional<Stock> getStockById(String id) {
        return stockRepository.findById(id);
    }

    public Stock updateStock(String id, Stock stock) {

        Stock existingStock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("स्टॉक रिकॉर्ड नहीं मिला"));

        // Old product
        Product oldProduct = productRepository.findById(existingStock.getProductId())
                .orElseThrow(() -> new RuntimeException("उत्पाद नहीं मिला"));

        // New product
        Product newProduct = productRepository.findById(stock.getProductId())
                .orElseThrow(() -> new RuntimeException("उत्पाद नहीं मिला"));

        // 1. Old stock entry ka effect reverse karo
        if (existingStock.getType().equalsIgnoreCase("IN")) {

            oldProduct.setStock(
                    oldProduct.getStock() - existingStock.getQuantity()
            );

        } else if (existingStock.getType().equalsIgnoreCase("OUT")) {

            oldProduct.setStock(
                    oldProduct.getStock() + existingStock.getQuantity()
            );
        }

        // 2. New stock entry ka effect apply karo
        if (stock.getType().equalsIgnoreCase("IN")) {

            newProduct.setStock(
                    newProduct.getStock() + stock.getQuantity()
            );

        } else if (stock.getType().equalsIgnoreCase("OUT")) {

            if (newProduct.getStock() < stock.getQuantity()) {
                throw new RuntimeException("पर्याप्त स्टॉक उपलब्ध नहीं है");
            }

            newProduct.setStock(
                    newProduct.getStock() - stock.getQuantity()
            );
        }

        // 3. Product save karo
        productRepository.save(oldProduct);

        // Agar product change hua hai to new product bhi save hoga
        if (!oldProduct.getId().equals(newProduct.getId())) {
            productRepository.save(newProduct);
        }

        // 4. Stock record update karo
        existingStock.setProductId(stock.getProductId());
        existingStock.setQuantity(stock.getQuantity());
        existingStock.setType(stock.getType());

        return stockRepository.save(existingStock);
    }

    public void deleteStock(String id) {

        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("स्टॉक रिकॉर्ड नहीं मिला"));

        Product product = productRepository.findById(stock.getProductId())
                .orElseThrow(() -> new RuntimeException("उत्पाद नहीं मिला"));

        if (stock.getType().equalsIgnoreCase("IN")) {

            product.setStock(
                    product.getStock() - stock.getQuantity()
            );

        } else if (stock.getType().equalsIgnoreCase("OUT")) {

            product.setStock(
                    product.getStock() + stock.getQuantity()
            );
        }

        productRepository.save(product);

        stockRepository.deleteById(id);
    }
}