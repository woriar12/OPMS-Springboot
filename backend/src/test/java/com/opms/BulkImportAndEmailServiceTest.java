package com.opms;

import com.opms.dto.BulkImportResultDto;
import com.opms.entity.Role;
import com.opms.entity.Student;
import com.opms.entity.User;
import com.opms.entity.UserStatus;
import com.opms.repository.DepartmentRepository;
import com.opms.repository.StudentRepository;
import com.opms.repository.UserRepository;
import com.opms.service.BulkImportService;
import com.opms.service.EmailService;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.mail.username=test@gmail.com",
    "spring.mail.password=test-app-password",
    "opms.mail.enabled=true"
})
public class BulkImportAndEmailServiceTest {

    @Autowired
    private BulkImportService bulkImportService;

    @Autowired
    private EmailService emailService;

    @MockBean
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    private User adminUser;

    @BeforeEach
    void setUp() {
        // Clear previous test student records (leave seeded admin/officer)
        studentRepository.deleteAll();
        userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.STUDENT)
                .forEach(userRepository::delete);

        adminUser = userRepository.findByUsername("admin").orElseGet(() -> {
            User a = User.builder()
                    .username("admin")
                    .email("admin@opms.edu")
                    .password("hash")
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();
            return userRepository.save(a);
        });

        // Configure test mail properties on real EmailService
        ReflectionTestUtils.setField(emailService, "mailUsername", "admin@gmail.com");
        ReflectionTestUtils.setField(emailService, "mailPassword", "appPassword123");
        ReflectionTestUtils.setField(emailService, "mailEnabled", true);

        // Default mock JavaMailSender setup for success
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doNothing().when(mailSender).send(any(MimeMessage.class));
    }

    @Test
    void test1_importSingleStudentWithValidEmail() {
        String csv = """
                Student Name,Email,Roll Number,Register Number,Department,College,University,Batch,Semester,CGPA,Active Backlogs
                Ananya Roy,ananya.roy@gmail.com,24CS101,REG24CS101,CSE,Engineering College,State University,2022-2026,6,8.9,0
                """;
        MockMultipartFile file = new MockMultipartFile("file", "students.csv", "text/csv", csv.getBytes(StandardCharsets.UTF_8));

        BulkImportResultDto result = bulkImportService.importStudents(file, adminUser);

        assertEquals(1, result.getTotalRecords());
        assertEquals(1, result.getSuccessfulRecords());
        assertEquals(0, result.getFailedRecords());
        assertEquals(1, result.getEmailsSubmitted());
        assertEquals(0, result.getEmailsFailed());
        assertTrue(result.getErrors().isEmpty());

        // Verify student saved in DB
        Optional<Student> student = studentRepository.findByRegisterNumber("REG24CS101");
        assertTrue(student.isPresent());
        assertEquals("Ananya Roy", student.get().getStudentName());
        assertEquals("ananya.roy@gmail.com", student.get().getEmail());

        // Verify real EmailService delivered through mailSender
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    void test2_importMultipleStudents() {
        String csv = """
                Student Name,Email,Roll Number,Register Number,Department,College,University,Batch,Semester,CGPA,Active Backlogs
                Karthik N,karthik.n@gmail.com,24CS102,REG24CS102,CSE,Engineering College,State University,2022-2026,6,8.5,0
                Sneha M,sneha.m@gmail.com,24EC103,REG24EC103,ECE,Engineering College,State University,2022-2026,6,8.2,0
                Vikas R,vikas.r@gmail.com,24EE104,REG24EE104,EEE,Engineering College,State University,2022-2026,6,7.9,0
                """;
        MockMultipartFile file = new MockMultipartFile("file", "students.csv", "text/csv", csv.getBytes(StandardCharsets.UTF_8));

        BulkImportResultDto result = bulkImportService.importStudents(file, adminUser);

        assertEquals(3, result.getTotalRecords());
        assertEquals(3, result.getSuccessfulRecords());
        assertEquals(0, result.getFailedRecords());
        assertEquals(3, result.getEmailsSubmitted());
        assertEquals(0, result.getEmailsFailed());

        assertEquals(3, studentRepository.count());
        verify(mailSender, times(3)).send(any(MimeMessage.class));
    }

    @Test
    void test3_importStudentWithInvalidEmail() {
        String csv = """
                Student Name,Email,Roll Number,Register Number,Department,College,University,Batch,Semester,CGPA,Active Backlogs
                Bad Email Student,not-an-email,24CS105,REG24CS105,CSE,Engineering College,State University,2022-2026,6,7.5,0
                """;
        MockMultipartFile file = new MockMultipartFile("file", "students.csv", "text/csv", csv.getBytes(StandardCharsets.UTF_8));

        BulkImportResultDto result = bulkImportService.importStudents(file, adminUser);

        assertEquals(1, result.getTotalRecords());
        assertEquals(0, result.getSuccessfulRecords());
        assertEquals(1, result.getFailedRecords());
        assertEquals(0, result.getEmailsSubmitted());
        assertEquals(0, result.getEmailsFailed());
        assertEquals(1, result.getErrors().size());
        assertTrue(result.getErrors().get(0).getMessage().contains("Invalid email address format"));

        // Verify student NOT saved in DB
        assertFalse(studentRepository.findByRegisterNumber("REG24CS105").isPresent());
        // Verify no email was sent
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    void test4_importDuplicateStudentRecords() {
        String csvFirst = """
                Student Name,Email,Roll Number,Register Number,Department,College,University,Batch,Semester,CGPA,Active Backlogs
                Amit Kumar,amit.kumar@gmail.com,24CS106,REG24CS106,CSE,Engineering College,State University,2022-2026,6,8.0,0
                """;
        MockMultipartFile file1 = new MockMultipartFile("file", "students.csv", "text/csv", csvFirst.getBytes(StandardCharsets.UTF_8));
        bulkImportService.importStudents(file1, adminUser);

        // Attempt to import duplicate record (same email and reg no)
        String csvDuplicate = """
                Student Name,Email,Roll Number,Register Number,Department,College,University,Batch,Semester,CGPA,Active Backlogs
                Amit Kumar Duplicate,amit.kumar@gmail.com,24CS106,REG24CS106,CSE,Engineering College,State University,2022-2026,6,8.0,0
                """;
        MockMultipartFile file2 = new MockMultipartFile("file", "students.csv", "text/csv", csvDuplicate.getBytes(StandardCharsets.UTF_8));
        BulkImportResultDto result = bulkImportService.importStudents(file2, adminUser);

        assertEquals(1, result.getTotalRecords());
        assertEquals(0, result.getSuccessfulRecords());
        assertEquals(1, result.getFailedRecords());
        assertEquals(0, result.getEmailsSubmitted());
        assertEquals(0, result.getEmailsFailed());
        assertTrue(result.getErrors().get(0).getMessage().contains("already exists"));

        // Verify only 1 email call in total from the first import
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    void test5_simulateSmtpFailure_databaseImportStillSucceeds() {
        // Simulate SMTP auth failure
        doThrow(new MailAuthenticationException("Authentication failed: 535-5.7.8 Username and Password not accepted"))
                .when(mailSender).send(any(MimeMessage.class));

        String csv = """
                Student Name,Email,Roll Number,Register Number,Department,College,University,Batch,Semester,CGPA,Active Backlogs
                Pooja S,pooja.s@gmail.com,24CS107,REG24CS107,CSE,Engineering College,State University,2022-2026,6,9.1,0
                """;
        MockMultipartFile file = new MockMultipartFile("file", "students.csv", "text/csv", csv.getBytes(StandardCharsets.UTF_8));

        BulkImportResultDto result = bulkImportService.importStudents(file, adminUser);

        // DB import still succeeds!
        assertEquals(1, result.getTotalRecords());
        assertEquals(1, result.getSuccessfulRecords());
        assertEquals(0, result.getFailedRecords());

        // Email submission reflects failure
        assertEquals(0, result.getEmailsSubmitted());
        assertEquals(1, result.getEmailsFailed());

        // Crucial requirement: student record is safely persisted in DB despite email delivery failure!
        Optional<Student> student = studentRepository.findByRegisterNumber("REG24CS107");
        assertTrue(student.isPresent());
        assertEquals("Pooja S", student.get().getStudentName());
        assertEquals("pooja.s@gmail.com", student.get().getEmail());
    }

    @Test
    void test6_partialEmailFailureDoesNotStopRemainingStudents() {
        // First email attempt fails with SMTP error, second succeeds
        doThrow(new MailAuthenticationException("Temporary SMTP error"))
                .doNothing()
                .when(mailSender).send(any(MimeMessage.class));

        String csv = """
                Student Name,Email,Roll Number,Register Number,Department,College,University,Batch,Semester,CGPA,Active Backlogs
                Student One,student1@gmail.com,24CS108,REG24CS108,CSE,Engineering College,State University,2022-2026,6,8.0,0
                Student Two,student2@gmail.com,24CS109,REG24CS109,CSE,Engineering College,State University,2022-2026,6,8.5,0
                """;
        MockMultipartFile file = new MockMultipartFile("file", "students.csv", "text/csv", csv.getBytes(StandardCharsets.UTF_8));

        BulkImportResultDto result = bulkImportService.importStudents(file, adminUser);

        assertEquals(2, result.getTotalRecords());
        assertEquals(2, result.getSuccessfulRecords());
        assertEquals(0, result.getFailedRecords());
        assertEquals(1, result.getEmailsSubmitted());
        assertEquals(1, result.getEmailsFailed());

        // Both students exist in DB
        assertTrue(studentRepository.findByRegisterNumber("REG24CS108").isPresent());
        assertTrue(studentRepository.findByRegisterNumber("REG24CS109").isPresent());

        // Both were attempted
        verify(mailSender, times(2)).send(any(MimeMessage.class));
    }
}
