package com.opms.service;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicLong;
import java.util.regex.Pattern;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${opms.mail.enabled:true}")
    private boolean mailEnabled;

    @Value("${opms.mail.from:}")
    private String configuredFrom;

    private final AtomicLong totalEmailsSent = new AtomicLong(0);
    private final AtomicLong totalEmailsFailed = new AtomicLong(0);

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public long getTotalEmailsSent() {
        return totalEmailsSent.get();
    }

    public long getTotalEmailsFailed() {
        return totalEmailsFailed.get();
    }

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    public static String maskEmail(String email) {
        if (email == null || email.isBlank()) {
            return "[empty]";
        }
        int atIndex = email.indexOf('@');
        if (atIndex <= 0 || atIndex == email.length() - 1) {
            if (email.length() <= 3) {
                return "***";
            }
            return email.charAt(0) + "***" + email.charAt(email.length() - 1);
        }
        String userPart = email.substring(0, atIndex);
        String domainPart = email.substring(atIndex + 1);

        String maskedUser;
        if (userPart.length() <= 2) {
            maskedUser = userPart.charAt(0) + "*";
        } else {
            maskedUser = userPart.charAt(0) + "***" + userPart.charAt(userPart.length() - 1);
        }

        return maskedUser + "@" + domainPart;
    }

    private boolean isSmtpConfigured() {
        return mailUsername != null && !mailUsername.isBlank() &&
               mailPassword != null && !mailPassword.isBlank();
    }

    public boolean sendStudentCredentials(String toEmail, String registerNumber, String tempPassword) {
        String maskedRecipient = maskEmail(toEmail);
        log.info("Preparing student account credentials email for recipient: {} | Register Number: {}", maskedRecipient, registerNumber);

        if (!isValidEmail(toEmail)) {
            log.error("SMTP sending failure: Invalid recipient email address '{}'. Total successful: {}, Total failed: {}",
                    maskedRecipient, totalEmailsSent.get(), totalEmailsFailed.incrementAndGet());
            return false;
        }

        String subject = "OPMS Student Account Credentials";
        String body = String.format("""
                Dear Student,

                Welcome to Online Placement Management System (OPMS).
                Your student account has been successfully created.

                Login Details:
                Portal: http://localhost:5173/login
                Username: %s
                Temporary Password: %s

                Please log in and change your password upon first login.

                Best regards,
                OPMS Placement Cell
                """, registerNumber, tempPassword);

        if (!mailEnabled) {
            log.info("[MOCK MAIL] Student credentials email simulated for recipient: {} | Register Number: {} (opms.mail.enabled=false)",
                    maskedRecipient, registerNumber);
            totalEmailsSent.incrementAndGet();
            return true;
        }

        return sendEmail(toEmail, subject, body);
    }

    public boolean sendCompanyCredentials(String toEmail, String username, String tempPassword, String companyName) {
        String maskedRecipient = maskEmail(toEmail);
        log.info("Preparing company credentials email for recipient: {} | Company: {}", maskedRecipient, companyName);

        if (!isValidEmail(toEmail)) {
            log.error("SMTP sending failure: Invalid recipient email address '{}'. Total successful: {}, Total failed: {}",
                    maskedRecipient, totalEmailsSent.get(), totalEmailsFailed.incrementAndGet());
            return false;
        }

        String subject = "OPMS Company Account Approved";
        String body = String.format("""
                Dear %s Team,

                Congratulations! Your company registration on Online Placement Management System has been approved.

                Your login credentials:
                Username: %s
                Temporary Password: %s

                Please login at http://localhost:5173 and change your password on first login.

                Regards,
                OPMS Placement Team
                """, companyName, username, tempPassword);

        if (!mailEnabled) {
            log.info("[MOCK MAIL] Company credentials simulated for recipient: {} | Company: {} (opms.mail.enabled=false)",
                    maskedRecipient, companyName);
            totalEmailsSent.incrementAndGet();
            return true;
        }
        return sendEmail(toEmail, subject, body);
    }

    public boolean sendDriveApprovalNotification(String toEmail, String companyName, String driveTitle) {
        String subject = "OPMS Drive Approved: " + driveTitle;
        String body = String.format("""
                Dear %s,

                Your placement drive '%s' has been approved by the Placement Officer.
                The drive is now active and eligible students can view and apply.

                Regards,
                OPMS Placement Team
                """, companyName, driveTitle);

        if (!mailEnabled) {
            log.info("[MOCK MAIL] Drive Approved simulated for recipient: {} | Drive: {} (opms.mail.enabled=false)",
                    maskEmail(toEmail), driveTitle);
            totalEmailsSent.incrementAndGet();
            return true;
        }
        return sendEmail(toEmail, subject, body);
    }

    public boolean sendDriveRejectionNotification(String toEmail, String companyName, String driveTitle, String reason) {
        String subject = "OPMS Drive Rejected: " + driveTitle;
        String body = String.format("""
                Dear %s,

                Your placement drive '%s' has been rejected.
                Reason: %s

                You may revise and resubmit the drive from your company dashboard.

                Regards,
                OPMS Placement Team
                """, companyName, driveTitle, reason);

        if (!mailEnabled) {
            log.info("[MOCK MAIL] Drive Rejected simulated for recipient: {} | Drive: {} (opms.mail.enabled=false)",
                    maskEmail(toEmail), driveTitle);
            totalEmailsSent.incrementAndGet();
            return true;
        }
        return sendEmail(toEmail, subject, body);
    }

    public boolean sendStudentShortlistedNotification(String toEmail, String studentName, String companyName, String driveTitle, String jobRole, String hrEmail, String hrContactPerson) {
        String subject = "🎉 Shortlisted: " + driveTitle + " - " + companyName;
        String hrContact = (hrContactPerson != null && !hrContactPerson.isBlank()) ? hrContactPerson : companyName + " HR Team";
        String hrMailStr = (hrEmail != null && !hrEmail.isBlank()) ? hrEmail : "hr@" + companyName.toLowerCase().replaceAll("[^a-z0-9]", "") + ".com";

        String body = String.format("""
                Dear %s,

                Congratulations! You have been SHORTLISTED by %s for the position of %s (%s).

                HR Contact Person: %s
                HR Email Address: %s

                Please log in to your OPMS Student Portal to check upcoming interview schedules and updates.

                Portal Link: http://localhost:5173/student/applications

                Best regards,
                %s
                %s
                """, studentName, companyName, jobRole, driveTitle, hrContact, hrMailStr, hrContact, companyName);

        if (!mailEnabled) {
            log.info("[MOCK MAIL from HR: {}] Shortlisted Notification simulated for recipient: {} | Student: {} (opms.mail.enabled=false)",
                    maskEmail(hrEmail), maskEmail(toEmail), studentName);
            totalEmailsSent.incrementAndGet();
            return true;
        }
        return sendEmailWithCustomFrom(hrEmail, hrEmail, hrContact, toEmail, subject, body);
    }

    public boolean sendInterviewScheduledNotification(String toEmail, String studentName, String companyName, String driveTitle, String details, String hrEmail, String hrContactPerson) {
        String subject = "📅 Interview Scheduled: " + driveTitle + " - " + companyName;
        String hrContact = (hrContactPerson != null && !hrContactPerson.isBlank()) ? hrContactPerson : companyName + " HR Team";
        String hrMailStr = (hrEmail != null && !hrEmail.isBlank()) ? hrEmail : "hr@" + companyName.toLowerCase().replaceAll("[^a-z0-9]", "") + ".com";

        String body = String.format("""
                Dear %s,

                Your interview for %s (%s) has been scheduled!

                Details:
                %s

                HR Contact Person: %s
                HR Email Address: %s

                Please log in to your OPMS Student Portal under 'Interviews' to view full details and meeting link.

                Portal Link: http://localhost:5173/student/interviews

                Best regards,
                %s
                %s
                """, studentName, companyName, driveTitle, details, hrContact, hrMailStr, hrContact, companyName);

        if (!mailEnabled) {
            log.info("[MOCK MAIL from HR: {}] Interview Scheduled simulated for recipient: {} | Student: {} (opms.mail.enabled=false)",
                    maskEmail(hrEmail), maskEmail(toEmail), studentName);
            totalEmailsSent.incrementAndGet();
            return true;
        }
        return sendEmailWithCustomFrom(hrEmail, hrEmail, hrContact, toEmail, subject, body);
    }

    public boolean sendStudentOfferedNotification(String toEmail, String studentName, String companyName, String driveTitle, String details, String hrEmail, String hrContactPerson) {
        String subject = "🏆 Congratulations! Job Offer Issued by " + companyName;
        String hrContact = (hrContactPerson != null && !hrContactPerson.isBlank()) ? hrContactPerson : companyName + " HR Team";
        String hrMailStr = (hrEmail != null && !hrEmail.isBlank()) ? hrEmail : "hr@" + companyName.toLowerCase().replaceAll("[^a-z0-9]", "") + ".com";

        String body = String.format("""
                Dear %s,

                Hearty Congratulations! You have been SELECTED and issued a Job Offer by %s for %s!

                Details:
                %s

                HR Contact Person: %s
                HR Email Address: %s

                Please log in to your OPMS Student Portal under 'Offers' to view your offer details and submit your acceptance response.

                Portal Link: http://localhost:5173/student/offers

                Best regards,
                %s
                %s
                """, studentName, companyName, driveTitle, details, hrContact, hrMailStr, hrContact, companyName);

        if (!mailEnabled) {
            log.info("[MOCK MAIL from HR: {}] Offer Issued simulated for recipient: {} | Student: {} (opms.mail.enabled=false)",
                    maskEmail(hrEmail), maskEmail(toEmail), studentName);
            totalEmailsSent.incrementAndGet();
            return true;
        }
        return sendEmailWithCustomFrom(hrEmail, hrEmail, hrContact, toEmail, subject, body);
    }

    private boolean sendEmail(String toEmail, String subject, String body) {
        String defaultSender = resolveDefaultSender();
        return sendEmailWithCustomFrom(defaultSender, defaultSender, "OPMS Placement Cell", toEmail, subject, body);
    }

    private String resolveDefaultSender() {
        if (configuredFrom != null && !configuredFrom.isBlank()) {
            return configuredFrom.trim();
        }
        if (mailUsername != null && !mailUsername.isBlank()) {
            return mailUsername.trim();
        }
        return "noreply@opms.edu";
    }

    private boolean sendEmailWithCustomFrom(String fromHrEmail, String replyToHrEmail, String hrContactPerson, String toEmail, String subject, String body) {
        String maskedRecipient = maskEmail(toEmail);
        log.info("Email sending started for recipient: {} | Subject: '{}'", maskedRecipient, subject);

        if (!isValidEmail(toEmail)) {
            log.error("SMTP sending failure: Invalid recipient email address '{}'. Total successful: {}, Total failed: {}",
                    maskedRecipient, totalEmailsSent.get(), totalEmailsFailed.incrementAndGet());
            return false;
        }

        if (!isSmtpConfigured()) {
            log.error("SMTP sending failure: Gmail SMTP credentials are not configured. Please set SPRING_MAIL_USERNAME and SPRING_MAIL_PASSWORD environment variables. Target: {}. Total successful: {}, Total failed: {}",
                    maskedRecipient, totalEmailsSent.get(), totalEmailsFailed.incrementAndGet());
            return false;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            String senderEmail = (fromHrEmail != null && !fromHrEmail.isBlank()) ? fromHrEmail.trim() : resolveDefaultSender();
            String senderName = (hrContactPerson != null && !hrContactPerson.isBlank()) ? hrContactPerson.trim() : "OPMS Placement Cell";

            try {
                helper.setFrom(new InternetAddress(senderEmail, senderName));
            } catch (Exception e) {
                helper.setFrom(senderEmail);
            }

            if (replyToHrEmail != null && !replyToHrEmail.isBlank()) {
                try {
                    helper.setReplyTo(new InternetAddress(replyToHrEmail.trim(), senderName));
                } catch (Exception e) {
                    helper.setReplyTo(replyToHrEmail.trim());
                }
            } else {
                helper.setReplyTo(senderEmail);
            }

            helper.setTo(toEmail.trim());
            helper.setSubject(subject);
            helper.setText(body);

            mailSender.send(mimeMessage);

            long successful = totalEmailsSent.incrementAndGet();
            log.info("SMTP sending success for recipient: {} (Note: SMTP submission accepted by server; actual delivery depends on recipient mail provider). Total successful emails: {}, Total failed emails: {}",
                    maskedRecipient, successful, totalEmailsFailed.get());
            return true;
        } catch (Exception e) {
            long failed = totalEmailsFailed.incrementAndGet();
            log.error("SMTP sending failure for recipient: {}. Reason: {}. Total successful emails: {}, Total failed emails: {}",
                    maskedRecipient, e.getMessage(), totalEmailsSent.get(), failed, e);
            return false;
        }
    }
}
