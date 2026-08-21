package com.opms.repository;

import com.opms.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {
    Optional<Offer> findByApplication(Application application);
    Optional<Offer> findByOfferNumber(String offerNumber);
    boolean existsByOfferNumber(String offerNumber);

    @Query("SELECT o FROM Offer o WHERE o.application.student = :student ORDER BY o.createdAt DESC")
    List<Offer> findByStudentOrderByCreatedAtDesc(@Param("student") Student student);

    @Query("SELECT o FROM Offer o WHERE o.application.drive.company = :company ORDER BY o.createdAt DESC")
    List<Offer> findByCompanyOrderByCreatedAtDesc(@Param("company") Company company);

    List<Offer> findAllByOrderByCreatedAtDesc();
}
