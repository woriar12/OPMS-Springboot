package com.opms.repository;

import com.opms.entity.Company;
import com.opms.entity.CompanyVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyVerificationRepository extends JpaRepository<CompanyVerification, Long> {
    List<CompanyVerification> findByCompanyOrderByCreatedAtDesc(Company company);
}
