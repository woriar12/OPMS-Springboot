package com.opms.repository;

import com.opms.entity.Student;
import com.opms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByEmail(String email);
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByRegisterNumber(String registerNumber);
    boolean existsByEmail(String email);
    boolean existsByRollNumber(String rollNumber);
    boolean existsByRegisterNumber(String registerNumber);
}
