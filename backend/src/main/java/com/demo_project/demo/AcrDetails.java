package com.demo_project.demo;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.*;

@Entity
@Table(name = "employee_acr_details", schema = "tran") // 🔷 Points to the exact schema and table
public class AcrDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Matches the 'bigserial' from the SQL
    @Column(name = "_id")
    private Long id;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "office_id")
    private Long officeId;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "target", columnDefinition = "TEXT")
    private String target;

    @JsonProperty("achievement")
    @Column(name = "achievement")
    private String achievements;

    // =======================================================
    // GETTERS AND SETTERS
    // =======================================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public Long getOfficeId() { return officeId; }
    public void setOfficeId(Long officeId) { this.officeId = officeId; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getAchievements() { return achievements; }
    public void setAchievements(String achievements) { this.achievements = achievements; }
}