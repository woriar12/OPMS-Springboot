package com.opms.config;

import com.opms.entity.*;
import com.opms.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PlacementOfficerRepository officerRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           PlacementOfficerRepository officerRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.officerRepository = officerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedDepartments();
        seedAdminUser();
        seedDefaultOfficer();
    }

    private void seedDepartments() {
        List<String[]> defaultDepts = List.of(
                new String[]{"CSE", "Computer Science & Engineering"},
                new String[]{"ECE", "Electronics & Communication Engineering"},
                new String[]{"EEE", "Electrical & Electronics Engineering"},
                new String[]{"MECH", "Mechanical Engineering"},
                new String[]{"CIVIL", "Civil Engineering"},
                new String[]{"IT", "Information Technology"},
                new String[]{"AIDS", "Artificial Intelligence & Data Science"},
                new String[]{"AIML", "Artificial Intelligence & Machine Learning"}
        );

        for (String[] dept : defaultDepts) {
            String code = dept[0];
            String name = dept[1];
            if (!departmentRepository.existsByDepartmentCode(code)) {
                Department department = Department.builder()
                        .departmentCode(code)
                        .departmentName(name)
                        .status("ACTIVE")
                        .build();
                departmentRepository.save(department);
                log.info("Seeded Department: {}", code);
            }
        }
    }

    private void seedAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("Admin@12345"))
                    .email("admin@opms.edu")
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .firstLogin(false)
                    .build();
            userRepository.save(admin);
            log.info("Seeded Default Admin [username: admin, password: Admin@12345]");
        }
    }

    private void seedDefaultOfficer() {
        if (!userRepository.existsByUsername("officer1")) {
            User officerUser = User.builder()
                    .username("officer1")
                    .password(passwordEncoder.encode("Officer@12345"))
                    .email("officer1@opms.edu")
                    .role(Role.PLACEMENT_OFFICER)
                    .status(UserStatus.ACTIVE)
                    .firstLogin(false)
                    .build();
            User savedUser = userRepository.save(officerUser);

            PlacementOfficer officer = PlacementOfficer.builder()
                    .user(savedUser)
                    .fullName("Default Placement Officer")
                    .employeeId("PO001")
                    .phone("9876543210")
                    .department("Placement Cell")
                    .build();
            officerRepository.save(officer);

            log.info("Seeded Default Placement Officer [username: officer1, password: Officer@12345]");
        }
    }
}
