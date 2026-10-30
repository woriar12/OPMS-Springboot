package com.opms;

import com.opms.service.EmailService;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class EmailServiceUnitTest {

    private JavaMailSender mailSender;
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        mailSender = mock(JavaMailSender.class);
        emailService = new EmailService(mailSender);
    }

    @Test
    void testEmailMasking() {
        assertEquals("[empty]", EmailService.maskEmail(null));
        assertEquals("[empty]", EmailService.maskEmail("   "));
        assertEquals("r***a@gmail.com", EmailService.maskEmail("rahul.sharma@gmail.com"));
        assertEquals("a***b@example.com", EmailService.maskEmail("akb@example.com"));
        assertEquals("a*@example.com", EmailService.maskEmail("ab@example.com"));
        assertEquals("a*@example.com", EmailService.maskEmail("a@example.com"));
        assertEquals("i***d", EmailService.maskEmail("invalid"));
    }

    @Test
    void testEmailValidation() {
        assertFalse(EmailService.isValidEmail(null));
        assertFalse(EmailService.isValidEmail(""));
        assertFalse(EmailService.isValidEmail("plainaddress"));
        assertFalse(EmailService.isValidEmail("@missingusername.com"));
        assertFalse(EmailService.isValidEmail("username@.com"));
        assertFalse(EmailService.isValidEmail("username@com"));

        assertTrue(EmailService.isValidEmail("student@gmail.com"));
        assertTrue(EmailService.isValidEmail("first.last@college.edu"));
        assertTrue(EmailService.isValidEmail("user+tag@example.co.in"));
    }

    @Test
    void testCredentialsUnconfigured() {
        ReflectionTestUtils.setField(emailService, "mailUsername", "");
        ReflectionTestUtils.setField(emailService, "mailPassword", "");
        ReflectionTestUtils.setField(emailService, "mailEnabled", true);

        boolean result = emailService.sendStudentCredentials("valid.student@gmail.com", "REG2024", "OPMS@1234");
        assertFalse(result, "Should fail when credentials are not configured");
        assertEquals(0, emailService.getTotalEmailsSent());
        assertEquals(1, emailService.getTotalEmailsFailed());
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    void testInvalidRecipientAddress() {
        ReflectionTestUtils.setField(emailService, "mailUsername", "admin@gmail.com");
        ReflectionTestUtils.setField(emailService, "mailPassword", "someAppPassword");
        ReflectionTestUtils.setField(emailService, "mailEnabled", true);

        boolean result = emailService.sendStudentCredentials("not-an-email", "REG2024", "OPMS@1234");
        assertFalse(result, "Should fail when recipient email address is invalid");
        assertEquals(0, emailService.getTotalEmailsSent());
        assertEquals(1, emailService.getTotalEmailsFailed());
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    void testMockMailEnabled() {
        ReflectionTestUtils.setField(emailService, "mailEnabled", false);

        boolean result = emailService.sendStudentCredentials("student@gmail.com", "REG2024", "OPMS@1234");
        assertTrue(result, "Mock mail mode should succeed without calling real SMTP");
        assertEquals(1, emailService.getTotalEmailsSent());
        assertEquals(0, emailService.getTotalEmailsFailed());
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    void testSmtpAuthenticationFailureHandling() {
        ReflectionTestUtils.setField(emailService, "mailUsername", "admin@gmail.com");
        ReflectionTestUtils.setField(emailService, "mailPassword", "wrongPassword");
        ReflectionTestUtils.setField(emailService, "mailEnabled", true);

        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new MailAuthenticationException("Authentication failed: 535-5.7.8 Username and Password not accepted"))
                .when(mailSender).send(any(MimeMessage.class));

        boolean result = emailService.sendStudentCredentials("student@gmail.com", "REG2024", "OPMS@1234");
        assertFalse(result, "Should return false on SMTP auth failure");
        assertEquals(0, emailService.getTotalEmailsSent());
        assertEquals(1, emailService.getTotalEmailsFailed());
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    void testSmtpSuccessfulSubmission() {
        ReflectionTestUtils.setField(emailService, "mailUsername", "admin@gmail.com");
        ReflectionTestUtils.setField(emailService, "mailPassword", "validAppPassword");
        ReflectionTestUtils.setField(emailService, "mailEnabled", true);

        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doNothing().when(mailSender).send(any(MimeMessage.class));

        boolean result = emailService.sendStudentCredentials("student@gmail.com", "REG2024", "OPMS@1234");
        assertTrue(result, "Should return true on successful SMTP submission");
        assertEquals(1, emailService.getTotalEmailsSent());
        assertEquals(0, emailService.getTotalEmailsFailed());
        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    void testLoadBulkImportService() {
        assertNotNull(com.opms.service.BulkImportService.class);
    }
}
