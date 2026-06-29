package com.demo_project.demo;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "employee_details", schema = "tran") // 🔷 Points to the official government table!
public class Employee {

    @Id
    @Column(name = "employee_id")
    private Long employeeId; 

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

    @Column(name = "gender", length = 1)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "mobile_number")
    private String mobileNumber;

    // Default constructor is required by Spring Boot
    public Employee() {}

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

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
}