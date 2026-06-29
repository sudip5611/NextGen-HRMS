package com.demo_project.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/acr") 
@CrossOrigin(origins = "*")
public class AcrController {

    @Autowired
    private AcrDetailsRepository acrDetailsRepository;

    @Autowired
    private AcrStatusRepository acrStatusRepository;

    // 🔷 Inject EmployeeRepository to fetch hierarchical data
    @Autowired
    private EmployeeRepository employeeRepository;

    // 🔷 1. SUBMIT ACR FORM
    @PostMapping("/submit")
    public String submitAcr(@RequestBody AcrDetails acrDetails) {
    	
    	// 🔷 ADD THESE TWO LINES TO SET THE TRAP:
        System.out.println("--- INCOMING REACT DATA ---");
        System.out.println("TARGET RECEIVED: " + acrDetails.getTarget());
        
        // (Depending on how your getters are named, this might be getAchievement() or getAchievements())
        System.out.println("ACHIEVEMENT RECEIVED: " + acrDetails.getAchievements()); 
        
        // ... the rest of your existing
        
        // Fetch employee hierarchy from the employee table
        Employee emp = employeeRepository.findById(acrDetails.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Inject hierarchical data into ACR record
        acrDetails.setOrganizationId(emp.getOrganizationId());
        acrDetails.setOfficeId(emp.getOfficeId());
        acrDetails.setDepartmentId(emp.getDepartmentId());
        
        acrDetailsRepository.save(acrDetails);

        // Update the tracker with hierarchy
        AcrStatus status = acrStatusRepository.findById(acrDetails.getEmployeeId()).orElse(new AcrStatus());
        status.setEmployeeId(acrDetails.getEmployeeId());
        status.setIsAcrSubmitted(true);
        status.setOrganizationId(emp.getOrganizationId());
        status.setOfficeId(emp.getOfficeId());
        status.setDepartmentId(emp.getDepartmentId());
        
        acrStatusRepository.save(status);

        return "ACR Form successfully saved to government records!";
    }
    
    // 🔷 2. GET ALL STATUSES (Feeds the React Admin Dashboard)
    @GetMapping("/status")
    public List<AcrStatus> getAllStatuses() {
        return acrStatusRepository.findAll();
    }
    
    // 🔷 3. GET ACR DETAILS BY EMPLOYEE ID (Admin Review)
    @GetMapping("/details/{employeeId}")
    public List<AcrDetails> getAcrDetails(@PathVariable Long employeeId) {
        return acrDetailsRepository.findByEmployeeId(employeeId);
    }
    
    // 🔷 4. SEND SINGLE NOTIFICATION
    @PostMapping("/notify/{employeeId}")
    public String notifyEmployee(@PathVariable Long employeeId) {
        Employee emp = employeeRepository.findById(employeeId).orElse(null);
        AcrStatus status = acrStatusRepository.findById(employeeId).orElse(new AcrStatus());
        
        status.setEmployeeId(employeeId);
        status.setIsNotified(true);
        
        if (emp != null) {
            status.setOrganizationId(emp.getOrganizationId());
            status.setOfficeId(emp.getOfficeId());
            status.setDepartmentId(emp.getDepartmentId());
        }
        
        if (status.getIsAcrSubmitted() == null) {
            status.setIsAcrSubmitted(false);
        }
        
        acrStatusRepository.save(status);
        return "Success: Official ACR notice dispatched to Employee ID " + employeeId;
    }

    // 🔷 5. BULK NOTIFICATIONS
    @PostMapping("/notify-bulk")
    @Transactional
    public String notifyBulkEmployees(@RequestBody List<Long> employeeIds) {
        if (employeeIds == null || employeeIds.isEmpty()) {
            return "Error: No personnel selected for notification.";
        }

        for (Long empId : employeeIds) {
            Employee emp = employeeRepository.findById(empId).orElse(null);
            AcrStatus status = acrStatusRepository.findById(empId).orElse(new AcrStatus());
            
            status.setEmployeeId(empId);
            status.setIsNotified(true);
            
            // Populate hierarchy if employee data is found
            if (emp != null) {
                status.setOrganizationId(emp.getOrganizationId());
                status.setOfficeId(emp.getOfficeId());
                status.setDepartmentId(emp.getDepartmentId());
            }
            
            if (status.getIsAcrSubmitted() == null) {
                status.setIsAcrSubmitted(false);
            }
            acrStatusRepository.save(status);
        }
        return "Success: Official ACR notices dispatched.";
    }

    // 🔷 6. ADMIN REVIEW
    @PostMapping("/review/{employeeId}")
    public String reviewAcr(
            @PathVariable Long employeeId, 
            @RequestParam String rating, 
            @RequestParam String approvalStatus) {
        
        AcrStatus status = acrStatusRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Status tracker record missing for ID: " + employeeId));
        
        status.setRating(rating);
        status.setApprovalStatus(approvalStatus);
        
        acrStatusRepository.save(status);
        
        return "Success: Record has been marked as " + approvalStatus + " with a tier profile of '" + rating + "'";
    }
}