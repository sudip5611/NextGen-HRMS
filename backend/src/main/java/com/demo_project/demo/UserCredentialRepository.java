package com.demo_project.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCredentialRepository extends JpaRepository<UserCredential, Long> {
    // Custom method to find a user's password by their ID
    UserCredential findByEmployeeId(Long employeeId);
}