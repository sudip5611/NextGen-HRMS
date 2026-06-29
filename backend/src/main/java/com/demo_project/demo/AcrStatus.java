package com.demo_project.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "employee_acr_status", schema = "tran") // 🔷 Points to the status tracker table
public class AcrStatus {

    @Id
    @Column(name = "employee_id")
    private Long employeeId; // This is the Primary Key here!

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "office_id")
    private Long officeId;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "emp_ini_name", length = 30)
    private String empIniName;

    @Column(name = "emp_first_name", length = 100)
    private String empFirstName;

    @Column(name = "emp_mid_name", length = 30)
    private String empMidName;

    @Column(name = "emp_last_name", length = 30)
    private String empLastName;

    @Column(name = "is_acr_submitted")
    private Boolean isAcrSubmitted;
    
    // 🔷 NEW: Added to track if the admin has sent the notice
    @Column(name = "is_notified")
    private Boolean isNotified;
    
    @Column(name = "rating", length = 50)
    private String rating;

    @Column(name = "approval_status", length = 50)
    private String approvalStatus;

    // =======================================================
    // GETTERS AND SETTERS
    // =======================================================

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public Long getOfficeId() { return officeId; }
    public void setOfficeId(Long officeId) { this.officeId = officeId; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getEmpIniName() { return empIniName; }
    public void setEmpIniName(String empIniName) { this.empIniName = empIniName; }

    public String getEmpFirstName() { return empFirstName; }
    public void setEmpFirstName(String empFirstName) { this.empFirstName = empFirstName; }

    public String getEmpMidName() { return empMidName; }
    public void setEmpMidName(String empMidName) { this.empMidName = empMidName; }

    public String getEmpLastName() { return empLastName; }
    public void setEmpLastName(String empLastName) { this.empLastName = empLastName; }

    public Boolean getIsAcrSubmitted() { return isAcrSubmitted; }
    public void setIsAcrSubmitted(Boolean isAcrSubmitted) { this.isAcrSubmitted = isAcrSubmitted; }

    // 🔷 NEW: Getters and Setters for the notification status
    public Boolean getIsNotified() { return isNotified; }
    public void setIsNotified(Boolean isNotified) { this.isNotified = isNotified; }
    
    // Getters and Setters
    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
}