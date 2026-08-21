package com.opms.repository;

import com.opms.entity.PlacementOfficer;
import com.opms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlacementOfficerRepository extends JpaRepository<PlacementOfficer, Long> {
    Optional<PlacementOfficer> findByUser(User user);
    boolean existsByEmployeeId(String employeeId);
}
