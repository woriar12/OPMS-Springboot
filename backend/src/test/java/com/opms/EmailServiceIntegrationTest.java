package com.opms;

import com.opms.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.mail.username=test@gmail.com",
    "spring.mail.password=test-app-password"
})
public class EmailServiceIntegrationTest {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private EmailService emailService;

    @Test
    void contextLoadsAndBeansCreated() {
        assertNotNull(emailService, "EmailService bean must be created in Spring context");
        assertNotNull(mailSender, "JavaMailSender bean must be auto-configured");
    }
}
