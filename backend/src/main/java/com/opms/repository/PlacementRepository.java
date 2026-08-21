package com.opms.repository;

import com.opms.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementRepository extends JpaRepository<Placement, Long> {
    Optional<Placement> findByStudent(Student student);
    boolean existsByStudent(Student student);

    List<Placement> findByCompany(Company company);
    List<Placement> findByDrive(PlacementDrive drive);

    @Query("SELECT p FROM Placement p WHERE p.student.department = :department")
    List<Placement> findByDepartment(@Param("department") Department department);

    @Query("SELECT COUNT(p) FROM Placement p WHERE p.student.department = :department")
    long countByDepartment(@Param("department") Department department);

    List<Placement> findAllByOrderByPlacementDateDesc();
}
