package com.opms.repository;

import com.opms.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByStudentAndDrive(Student student, PlacementDrive drive);
    Optional<Application> findByStudentAndDrive(Student student, PlacementDrive drive);

    List<Application> findByStudentOrderByAppliedAtDesc(Student student);
    List<Application> findByDriveOrderByAppliedAtDesc(PlacementDrive drive);

    long countByStudent(Student student);
    long countByStudentAndStatus(Student student, ApplicationStatus status);
    long countByStudentAndStatusIn(Student student, List<ApplicationStatus> statuses);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.drive.company = :company")
    long countByCompany(@Param("company") Company company);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.drive.company = :company AND a.status = :status")
    long countByCompanyAndStatus(@Param("company") Company company, @Param("status") ApplicationStatus status);

    @Query("SELECT a FROM Application a WHERE a.drive.company = :company ORDER BY a.appliedAt DESC")
    List<Application> findByCompanyOrderByAppliedAtDesc(@Param("company") Company company);

    List<Application> findAllByOrderByAppliedAtDesc();
    long countByStatus(ApplicationStatus status);
}
