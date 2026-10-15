package com.aidukaan.controller;

import com.aidukaan.model.Bill;
import com.aidukaan.service.BillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:5173")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping
    public Bill addBill(@RequestBody Bill bill) {
        return billService.addBill(bill);
    }

    @GetMapping
    public List<Bill> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/{id}")
    public Bill getBillById(@PathVariable String id) {
        return billService.getBillById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
    }

    @PutMapping("/{id}")
    public Bill updateBill(@PathVariable String id,
                           @RequestBody Bill bill) {
        return billService.updateBill(id, bill);
    }

    @DeleteMapping("/{id}")
    public String deleteBill(@PathVariable String id) {
        billService.deleteBill(id);
        return "Bill deleted successfully";
    }
}