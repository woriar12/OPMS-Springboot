package com.opms.repository;

import com.opms.entity.Company;
import com.opms.entity.CompanyStatus;
import com.opms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByUser(User user);
    Optional<Company> findByHrEmail(String hrEmail);
    Optional<Company> findByCompanyName(String companyName);
    boolean existsByCompanyName(String companyName);
    boolean existsByHrEmail(String hrEmail);
    List<Company> findByStatus(CompanyStatus status);
    List<Company> findAllByOrderByCreatedAtDesc();
    long countByStatus(CompanyStatus status);
}
