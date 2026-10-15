package com.aidukaan.controller;

import com.aidukaan.model.Bill;
import com.aidukaan.model.Product;
import com.aidukaan.repository.BillRepository;
import com.aidukaan.repository.CustomerRepository;
import com.aidukaan.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final BillRepository billRepository;

    public DashboardController(ProductRepository productRepository,
                               CustomerRepository customerRepository,
                               BillRepository billRepository) {
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.billRepository = billRepository;
    }

    @GetMapping
    public Map<String, Object> getDashboard() {

        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("totalProducts", productRepository.count());
        dashboard.put("totalCustomers", customerRepository.count());

        List<Product> products = productRepository.findAll();

        long lowStock = products.stream()
                .filter(product -> product.getStock() <= 5)
                .count();

        dashboard.put("lowStockProducts", lowStock);

        LocalDate today = LocalDate.now();

        double todaySale = billRepository.findAll()
                .stream()
                .filter(bill -> bill.getCreatedAt() != null)
                .filter(bill -> bill.getCreatedAt()
                        .toLocalDate()
                        .equals(today))
                .mapToDouble(Bill::getTotalAmount)
                .sum();

        dashboard.put("todaySale", todaySale);

        return dashboard;
    }
}