package com.opms.repository;

import com.opms.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByDepartmentCode(String departmentCode);
    Optional<Department> findByDepartmentNameIgnoreCase(String departmentName);
    boolean existsByDepartmentCode(String departmentCode);
    boolean existsByDepartmentNameIgnoreCase(String departmentName);
}
