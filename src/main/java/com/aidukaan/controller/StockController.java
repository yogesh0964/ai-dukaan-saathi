package com.aidukaan.controller;

import com.aidukaan.model.Stock;
import com.aidukaan.service.StockService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "http://localhost:5173")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping
    public Stock addStock(@RequestBody Stock stock) {
        return stockService.addStock(stock);
    }

    @GetMapping
    public List<Stock> getAllStock() {
        return stockService.getAllStock();
    }

    @GetMapping("/{id}")
    public Stock getStockById(@PathVariable String id) {
        return stockService.getStockById(id)
                .orElseThrow(() -> new RuntimeException("स्टॉक रिकॉर्ड नहीं मिला"));
    }

    @PutMapping("/{id}")
    public Stock updateStock(@PathVariable String id,
                             @RequestBody Stock stock) {
        return stockService.updateStock(id, stock);
    }

    @DeleteMapping("/{id}")
    public String deleteStock(@PathVariable String id) {
        stockService.deleteStock(id);
        return "Stock deleted successfully";
    }
}