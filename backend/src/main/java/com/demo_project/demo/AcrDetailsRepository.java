package com.demo_project.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AcrDetailsRepository extends JpaRepository<AcrDetails, Long> {
    
    // Custom method to fetch all targets/achievements for a specific employee
    List<AcrDetails> findByEmployeeId(Long employeeId);
}