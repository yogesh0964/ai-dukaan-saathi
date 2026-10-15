package com.aidukaan.service;

import com.aidukaan.model.Bill;
import com.aidukaan.model.BillItem;
import com.aidukaan.model.Product;
import com.aidukaan.repository.BillRepository;
import com.aidukaan.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final ProductRepository productRepository;

    public BillService(BillRepository billRepository,
                       ProductRepository productRepository) {

        this.billRepository = billRepository;
        this.productRepository = productRepository;
    }

    // CREATE BILL
    public Bill addBill(Bill bill) {

        Map<String, Integer> quantities =
                new HashMap<>();

        // Duplicate products ko combine karo
        for (BillItem item : bill.getItems()) {

            if (item.getQuantity() <= 0) {
                throw new RuntimeException(
                        "Quantity must be greater than 0"
                );
            }

            quantities.put(
                    item.getProductId(),
                    quantities.getOrDefault(
                            item.getProductId(), 0
                    ) + item.getQuantity()
            );
        }

        // Sabhi products aur total quantity validate karo
        for (Map.Entry<String, Integer> entry :
                quantities.entrySet()) {

            String productId = entry.getKey();
            int totalQuantity = entry.getValue();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Product not found"
                            )
                    );

            if (product.getStock() < totalQuantity) {

                throw new RuntimeException(
                        "Not enough stock for product: "
                                + product.getName()
                );
            }
        }

        // Stock ek baar reduce karo
        for (Map.Entry<String, Integer> entry :
                quantities.entrySet()) {

            String productId = entry.getKey();
            int totalQuantity = entry.getValue();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Product not found"
                            )
                    );

            product.setStock(
                    product.getStock() - totalQuantity
            );

            productRepository.save(product);
        }

        bill.setCreatedAt(LocalDateTime.now());

        return billRepository.save(bill);
    }

    // GET ALL BILLS
    public List<Bill> getAllBills() {

        return billRepository.findAll();
    }

    // GET BILL BY ID
    public Optional<Bill> getBillById(String id) {

        return billRepository.findById(id);
    }

    // UPDATE BILL + STOCK
    public Bill updateBill(String id, Bill bill) {

        Bill existingBill = billRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bill not found"
                        )
                );

        Map<String, Integer> oldQuantities =
                new HashMap<>();

        Map<String, Integer> newQuantities =
                new HashMap<>();

        // Old bill quantities
        for (BillItem item : existingBill.getItems()) {

            oldQuantities.put(
                    item.getProductId(),
                    oldQuantities.getOrDefault(
                            item.getProductId(), 0
                    ) + item.getQuantity()
            );
        }

        // New bill quantities
        for (BillItem item : bill.getItems()) {

            if (item.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Quantity must be greater than 0"
                );
            }

            newQuantities.put(
                    item.getProductId(),
                    newQuantities.getOrDefault(
                            item.getProductId(), 0
                    ) + item.getQuantity()
            );
        }

        // Check new products
        for (String productId :
                newQuantities.keySet()) {

            productRepository.findById(productId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Product not found"
                            )
                    );
        }

        Set<String> productIds =
                new HashSet<>();

        productIds.addAll(
                oldQuantities.keySet()
        );

        productIds.addAll(
                newQuantities.keySet()
        );

        // Stock validation
        for (String productId :
                productIds) {

            Product product =
                    productRepository.findById(productId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Product not found"
                                    )
                            );

            int oldQuantity =
                    oldQuantities.getOrDefault(
                            productId, 0
                    );

            int newQuantity =
                    newQuantities.getOrDefault(
                            productId, 0
                    );

            int finalStock =
                    product.getStock()
                            + oldQuantity
                            - newQuantity;

            if (finalStock < 0) {

                throw new RuntimeException(
                        "Not enough stock for product: "
                                + product.getName()
                );
            }
        }

        // Stock update
        for (String productId :
                productIds) {

            Product product =
                    productRepository.findById(productId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Product not found"
                                    )
                            );

            int oldQuantity =
                    oldQuantities.getOrDefault(
                            productId, 0
                    );

            int newQuantity =
                    newQuantities.getOrDefault(
                            productId, 0
                    );

            int finalStock =
                    product.getStock()
                            + oldQuantity
                            - newQuantity;

            product.setStock(finalStock);

            productRepository.save(product);
        }

        // Bill update
        existingBill.setCustomerId(
                bill.getCustomerId()
        );

        existingBill.setItems(
                bill.getItems()
        );

        existingBill.setTotalAmount(
                bill.getTotalAmount()
        );

        return billRepository.save(
                existingBill
        );
    }

    // DELETE BILL
    public void deleteBill(String id) {

        Bill bill = billRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bill not found"
                        )
                );

        for (BillItem item :
                bill.getItems()) {

            Optional<Product> product =
                    productRepository.findById(
                            item.getProductId()
                    );

            // Product exists -> restore stock
            if (product.isPresent()) {

                Product p = product.get();

                p.setStock(
                        p.getStock()
                                + item.getQuantity()
                );

                productRepository.save(p);
            }

            // Product deleted hai
            // -> Bill delete phir bhi hoga
        }

        billRepository.deleteById(id);
    }
}