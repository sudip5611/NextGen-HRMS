package com.demo_project.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserCredentialRepository userRepo;

    // 🔷 NEW: This lets us safely query the master employee table
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/signup")
    public String signup(@RequestBody UserCredential user) {
        if (userRepo.findByEmployeeId(user.getEmployeeId()) != null) {
            return "Error: An account with this Employee ID already exists!";
        }
        userRepo.save(user);
        return "Signup successful! You can now log in.";
    }

    @PostMapping("/login")
    public UserCredential login(@RequestBody UserCredential loginRequest) {
        UserCredential user = userRepo.findByEmployeeId(loginRequest.getEmployeeId());
        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            return user;
        }
        return null;
    }

    // 🔷 NEW: FORGOT PASSWORD API
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody Map<String, String> request) {
        try {
            Long empId = Long.parseLong(request.get("employeeId"));
            String mobile = request.get("mobileNumber");
            String newPassword = request.get("newPassword");

            // 1. Fetch the official mobile number from the government master table
            String sql = "SELECT mobile_number FROM tran.employee_details WHERE employee_id = ?";
            String officialMobile = jdbcTemplate.queryForObject(sql, String.class, empId);
            
            // 2. Check if the typed mobile number matches the database perfectly
            if (officialMobile != null && officialMobile.equals(mobile)) {
                UserCredential user = userRepo.findByEmployeeId(empId);
                if (user != null) {
                    // 3. Update the password!
                    user.setPassword(newPassword);
                    userRepo.save(user);
                    return "Success: Password has been securely reset!";
                } else {
                    return "Error: Account not found. Please register first.";
                }
            } else {
                return "Error: Mobile number does not match official HR records!";
            }
        } catch (Exception e) {
            return "Error: Employee ID not found in the master HR database.";
        }
    }
}