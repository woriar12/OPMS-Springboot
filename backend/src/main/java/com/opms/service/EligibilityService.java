package com.opms.service;

import com.opms.dto.PlacementDriveDto;
import com.opms.entity.*;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * EligibilityService — reusable eligibility computation.
 */
@Service
public class EligibilityService {

    private static final Logger log = LoggerFactory.getLogger(EligibilityService.class);

    private final PlacementDriveRepository driveRepository;
    private final PlacementDriveDepartmentRepository driveDeptRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PlacementDriveService driveService;
    private final OfferRepository offerRepository;

    public EligibilityService(PlacementDriveRepository driveRepository,
                              PlacementDriveDepartmentRepository driveDeptRepository,
                              StudentRepository studentRepository,
                              UserRepository userRepository,
                              PlacementDriveService driveService,
                              OfferRepository offerRepository) {
        this.driveRepository = driveRepository;
        this.driveDeptRepository = driveDeptRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.driveService = driveService;
        this.offerRepository = offerRepository;
    }

    public boolean isEligible(Student student, PlacementDrive drive) {
        if (drive.getStatus() != DriveStatus.ACTIVE && drive.getStatus() != DriveStatus.APPROVED) {
            log.info("Drive '{}' [id={}] not eligible for {}: status is {}", drive.getTitle(), drive.getId(), student.getStudentName(), drive.getStatus());
            return false;
        }

        // Check Higher-Package Placement Upgrade Policy
        if (offerRepository != null) {
            List<Offer> existingOffers = offerRepository.findByStudentOrderByCreatedAtDesc(student);
            Double maxOfferCtc = existingOffers.stream()
                    .filter(o -> o.getStatus() != OfferStatus.DECLINED && o.getStatus() != OfferStatus.EXPIRED)
                    .map(Offer::getCtc)
                    .filter(java.util.Objects::nonNull)
                    .max(Double::compareTo)
                    .orElse(0.0);

            if (maxOfferCtc > 0.0) {
                Double drivePackage = drive.getSalaryMax() != null ? drive.getSalaryMax()
                        : (drive.getSalaryMin() != null ? drive.getSalaryMin() : 0.0);

                if (drivePackage > 0.0 && drivePackage <= maxOfferCtc) {
                    log.info("Drive '{}' (₹{} LPA) not eligible for {}: student already holds an equal or higher offer of ₹{} LPA",
                            drive.getTitle(), drivePackage, student.getStudentName(), maxOfferCtc);
                    return false;
                }
            }
        }

        // Check department eligibility
        List<PlacementDriveDepartment> deptMappings = driveDeptRepository.findByDrive(drive);
        if (!deptMappings.isEmpty()) {
            if (student.getDepartment() == null) {
                log.info("Drive '{}' not eligible for {}: student has no department", drive.getTitle(), student.getStudentName());
                return false;
            }
            boolean deptEligible = deptMappings.stream().anyMatch(pdd -> {
                if (pdd.getDepartment() == null) return false;
                return pdd.getDepartment().getId().equals(student.getDepartment().getId())
                        || (pdd.getDepartment().getDepartmentCode() != null
                            && pdd.getDepartment().getDepartmentCode().equalsIgnoreCase(student.getDepartment().getDepartmentCode()));
            });
            if (!deptEligible) {
                log.info("Drive '{}' not eligible for {}: department {} not in mapped drive departments",
                        drive.getTitle(), student.getStudentName(), student.getDepartment().getDepartmentCode());
                return false;
            }
        }

        // Check CGPA
        if (drive.getMinimumCgpa() != null && student.getCgpa() != null && student.getCgpa() < drive.getMinimumCgpa()) {
            log.info("Drive '{}' not eligible for {}: CGPA {} < min CGPA {}", drive.getTitle(), student.getStudentName(), student.getCgpa(), drive.getMinimumCgpa());
            return false;
        }

        // Check backlogs
        if (drive.getMaximumBacklogs() != null && student.getActiveBacklogs() != null && student.getActiveBacklogs() > drive.getMaximumBacklogs()) {
            log.info("Drive '{}' not eligible for {}: backlogs {} > max backlogs {}", drive.getTitle(), student.getStudentName(), student.getActiveBacklogs(), drive.getMaximumBacklogs());
            return false;
        }

        // Check batch
        if (drive.getGraduationBatch() != null && !drive.getGraduationBatch().isBlank() && !drive.getGraduationBatch().equalsIgnoreCase("ALL")) {
            String studentBatch = student.getBatch() != null ? student.getBatch().toLowerCase().trim() : "";
            String driveBatch = drive.getGraduationBatch().toLowerCase().trim();
            if (!studentBatch.isEmpty()) {
                boolean match = studentBatch.contains(driveBatch) || driveBatch.contains(studentBatch);
                    // Check 4-digit years with 1-year tolerance
                    String[] driveYears = driveBatch.split("[^0-9]+");
                    String[] studentYears = studentBatch.split("[^0-9]+");
                    boolean yearMatch = false;
                    for (String dy : driveYears) {
                        if (dy.length() == 4) {
                            try {
                                int dYear = Integer.parseInt(dy);
                                for (String sy : studentYears) {
                                    if (sy.length() == 4) {
                                        int sYear = Integer.parseInt(sy);
                                        if (Math.abs(sYear - dYear) <= 1) {
                                            yearMatch = true;
                                            break;
                                        }
                                    }
                                }
                            } catch (Exception ignored) {}
                        }
                    }
                    if (!yearMatch) {
                        log.info("Drive '{}' not eligible for {}: batch mismatch (student batch: '{}', drive batch: '{}')",
                                drive.getTitle(), student.getStudentName(), student.getBatch(), drive.getGraduationBatch());
                        return false;
                    }
            }
        }

        return true;
    }

    /**
     * Get all eligible active drives for a student.
     * Ready for Phase 3 student application module.
     */
    @Transactional(readOnly = true)
    public List<PlacementDriveDto> getEligibleDrivesForStudent(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        List<PlacementDrive> drives = new ArrayList<>(driveRepository.findByStatusOrderByCreatedAtDesc(DriveStatus.ACTIVE));
        drives.addAll(driveRepository.findByStatusOrderByCreatedAtDesc(DriveStatus.APPROVED));

        return drives.stream()
                .filter(drive -> isEligible(student, drive))
                .map(driveService::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Count eligible students for a drive (for officer monitoring dashboard).
     */
    @Transactional(readOnly = true)
    public long countEligibleStudents(PlacementDrive drive) {
        return studentRepository.findAll().stream()
                .filter(student -> isEligible(student, drive))
                .count();
    }
}
