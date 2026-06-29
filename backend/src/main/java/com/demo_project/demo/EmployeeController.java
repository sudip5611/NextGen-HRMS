package com.demo_project.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/employees") // The URL your React app will call
@CrossOrigin(origins = "*") // Allows React to talk to Spring Boot
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    // 🔷 GET ALL EMPLOYEES (Fetches the manual entries from pgAdmin)
    @GetMapping
    public List<Employee> getEmployees() {
        return employeeRepository.findAll(); 
    }

    // 🔷 GET EMPLOYEE BY ID
    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeRepository.findById(id).orElse(null);
    }
    
    // 🔷 UPDATE EMPLOYEE (Fixed to match the new database columns!)
    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee emp) {
        return employeeRepository.findById(id).map(existingEmp -> {
            existingEmp.setEmpFirstName(emp.getEmpFirstName());
            existingEmp.setEmpLastName(emp.getEmpLastName());
            existingEmp.setDepartmentId(emp.getDepartmentId());
            existingEmp.setOrganizationId(emp.getOrganizationId());
            existingEmp.setDateOfBirth(emp.getDateOfBirth());
            return employeeRepository.save(existingEmp);
        }).orElse(null);
    }

    // 🔷 DELETE
    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable Long id) {
        employeeRepository.deleteById(id);
        return "Employee deleted successfully";
    }
}