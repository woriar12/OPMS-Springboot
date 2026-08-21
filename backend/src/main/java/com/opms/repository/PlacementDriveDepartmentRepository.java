package com.opms.repository;

import com.opms.entity.PlacementDrive;
import com.opms.entity.PlacementDriveDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementDriveDepartmentRepository extends JpaRepository<PlacementDriveDepartment, Long> {
    List<PlacementDriveDepartment> findByDrive(PlacementDrive drive);
    void deleteByDrive(PlacementDrive drive);
}
