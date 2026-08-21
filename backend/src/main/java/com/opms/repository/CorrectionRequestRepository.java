package com.opms.repository;

import com.opms.entity.CorrectionRequest;
import com.opms.entity.CorrectionStatus;
import com.opms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CorrectionRequestRepository extends JpaRepository<CorrectionRequest, Long> {
    List<CorrectionRequest> findByStudentOrderByCreatedAtDesc(Student student);
    List<CorrectionRequest> findAllByOrderByCreatedAtDesc();
    long countByStatus(CorrectionStatus status);
}
