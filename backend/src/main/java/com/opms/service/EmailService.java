package com.opms.service;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${opms.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${opms.mail.from:noreply@opms.edu}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean sendStudentCredentials(String toEmail, String registerNumber, String tempPassword) {
        String subject = "OPMS Student Account Credentials";
        String body = String.format("""
                Welcome to Online Placement Management System.
                
                Your student account has been created.
                
                Username: %s
                Temporary Password: %s
                
                Please login and change your password during your first login.
                
                Regards,
                OPMS Administration
                """, registerNumber, tempPassword);

        if (!mailEnabled) {
            log.info("[MOCK MAIL] Student Credentials | Email: {} | Username: {} | Password: {}", toEmail, registerNumber, tempPassword);
            return true;
        }
        return sendEmail(toEmail, subject, body);
    }

    public boolean sendCompanyCredentials(String toEmail, String username, String tempPassword, String companyName) {
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
            log.info("[MOCK MAIL] Company Credentials | Email: {} | Company: {} | Username: {} | Password: {}", toEmail, companyName, username, tempPassword);
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
            log.info("[MOCK MAIL] Drive Approved | Email: {} | Drive: {}", toEmail, driveTitle);
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
            log.info("[MOCK MAIL] Drive Rejected | Email: {} | Drive: {} | Reason: {}", toEmail, driveTitle, reason);
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
            log.info("[MOCK MAIL from HR: {}] Shortlisted Notification | Email: {} | Student: {} | Drive: {}", hrEmail, toEmail, studentName, driveTitle);
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
            log.info("[MOCK MAIL from HR: {}] Interview Scheduled Notification | Email: {} | Student: {} | Details: {}", hrEmail, toEmail, studentName, details);
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
            log.info("[MOCK MAIL from HR: {}] Offer Issued Notification | Email: {} | Student: {} | Company: {}", hrEmail, toEmail, studentName, companyName);
            return true;
        }
        return sendEmailWithCustomFrom(hrEmail, hrEmail, hrContact, toEmail, subject, body);
    }

    private boolean sendEmail(String toEmail, String subject, String body) {
        return sendEmailWithCustomFrom(fromEmail, fromEmail, "Placement Cell", toEmail, subject, body);
    }

    private boolean sendEmailWithCustomFrom(String fromHrEmail, String replyToHrEmail, String hrContactPerson, String toEmail, String subject, String body) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            String senderEmail = (fromHrEmail != null && !fromHrEmail.isBlank()) ? fromHrEmail : fromEmail;
            String senderName = (hrContactPerson != null && !hrContactPerson.isBlank()) ? hrContactPerson : "Placement Cell";

            try {
                helper.setFrom(new InternetAddress(senderEmail, senderName));
            } catch (Exception e) {
                helper.setFrom(senderEmail);
            }

            if (replyToHrEmail != null && !replyToHrEmail.isBlank()) {
                try {
                    helper.setReplyTo(new InternetAddress(replyToHrEmail, senderName));
                } catch (Exception e) {
                    helper.setReplyTo(replyToHrEmail);
                }
            } else {
                helper.setReplyTo(senderEmail);
            }

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body);

            mailSender.send(mimeMessage);
            log.info("HR Email sent from '{}' <{}> (Reply-To: {}) to {}", senderName, senderEmail, replyToHrEmail, toEmail);
            return true;
        } catch (Exception e) {
            log.error("Failed to send MimeMessage HR email to {}: {}", toEmail, e.getMessage());
            // Fallback to simple mail message
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                String sender = (fromHrEmail != null && !fromHrEmail.isBlank()) ? fromHrEmail : fromEmail;
                message.setFrom(sender);
                message.setReplyTo(sender);
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                return true;
            } catch (Exception ex) {
                log.error("Fallback SimpleMailMessage also failed for {}: {}", toEmail, ex.getMessage());
                return false;
            }
        }
    }
}
