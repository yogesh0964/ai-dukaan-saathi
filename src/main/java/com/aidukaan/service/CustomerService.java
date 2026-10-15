package com.aidukaan.service;

import com.aidukaan.model.Customer;
import com.aidukaan.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer addCustomer(Customer customer) {

        if (!customerRepository.findAllByPhone(customer.getPhone()).isEmpty()) {
            throw new RuntimeException("Phone number already registered");
        }

        if (customer.getEmail() != null && !customer.getEmail().isBlank()
                && !customerRepository.findAllByEmail(customer.getEmail()).isEmpty()) {
            throw new RuntimeException("Email already registered");
        }

        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(String id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer updateCustomer(String id, Customer customer) {

        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        boolean phoneUsedByOther = customerRepository
                .findAllByPhone(customer.getPhone())
                .stream()
                .anyMatch(c -> !c.getId().equals(id));

        if (phoneUsedByOther) {
            throw new RuntimeException("Phone number already registered");
        }

        if (customer.getEmail() != null && !customer.getEmail().isBlank()) {

            boolean emailUsedByOther = customerRepository
                    .findAllByEmail(customer.getEmail())
                    .stream()
                    .anyMatch(c -> !c.getId().equals(id));

            if (emailUsedByOther) {
                throw new RuntimeException("Email already registered");
            }
        }

        existingCustomer.setName(customer.getName());
        existingCustomer.setPhone(customer.getPhone());
        existingCustomer.setEmail(customer.getEmail());
        existingCustomer.setAddress(customer.getAddress());

        return customerRepository.save(existingCustomer);
    }

    public void deleteCustomer(String id) {

        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found");
        }

        customerRepository.deleteById(id);
    }
}