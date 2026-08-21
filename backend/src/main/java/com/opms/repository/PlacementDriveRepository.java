package com.opms.repository;

import com.opms.entity.Company;
import com.opms.entity.DriveStatus;
import com.opms.entity.PlacementDrive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {
    List<PlacementDrive> findByCompanyOrderByCreatedAtDesc(Company company);
    List<PlacementDrive> findByStatusOrderByCreatedAtDesc(DriveStatus status);
    List<PlacementDrive> findAllByOrderByCreatedAtDesc();
    long countByStatus(DriveStatus status);
    long countByCompanyAndStatus(Company company, DriveStatus status);
    long countByCompany(Company company);

    @Query("SELECT pd FROM PlacementDrive pd WHERE pd.status IN :statuses ORDER BY pd.createdAt DESC")
    List<PlacementDrive> findByStatusIn(@Param("statuses") List<DriveStatus> statuses);

    @Query("SELECT pd FROM PlacementDrive pd JOIN PlacementDriveDepartment pdd ON pdd.drive = pd WHERE pdd.department.id = :deptId AND pd.status = :status")
    List<PlacementDrive> findByDepartmentAndStatus(@Param("deptId") Long deptId, @Param("status") DriveStatus status);
}
