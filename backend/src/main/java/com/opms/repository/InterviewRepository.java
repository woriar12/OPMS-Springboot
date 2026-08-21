package com.opms.repository;

import com.opms.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByApplicationOrderByScheduledDateDescStartTimeDesc(Application application);

    @Query("SELECT i FROM Interview i WHERE i.application.student = :student ORDER BY i.scheduledDate DESC")
    List<Interview> findByStudentOrderByScheduledDateDesc(@Param("student") Student student);

    @Query("SELECT i FROM Interview i WHERE i.application.drive.company = :company ORDER BY i.scheduledDate DESC")
    List<Interview> findByCompanyOrderByScheduledDateDesc(@Param("company") Company company);

    List<Interview> findAllByOrderByScheduledDateDesc();
}
