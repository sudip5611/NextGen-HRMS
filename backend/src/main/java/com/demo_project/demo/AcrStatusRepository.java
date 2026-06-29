package com.demo_project.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcrStatusRepository extends JpaRepository<AcrStatus, Long> {
    
    // Because employeeId is the Primary Key in this table, 
    // Spring Boot automatically gives us findById(), so we don't need custom methods here right now!
}