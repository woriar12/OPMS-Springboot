package com.opms.service;

import com.opms.dto.BulkImportResultDto;
import com.opms.dto.ImportErrorDto;
import com.opms.entity.*;
import com.opms.exception.BadRequestException;
import com.opms.repository.DepartmentRepository;
import com.opms.repository.StudentRepository;
import com.opms.repository.UserRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.*;

@Service
public class BulkImportService {

    private static final Logger log = LoggerFactory.getLogger(BulkImportService.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AuditLogService auditLogService;
    private final TransactionTemplate transactionTemplate;

    public BulkImportService(UserRepository userRepository,
                             StudentRepository studentRepository,
                             DepartmentRepository departmentRepository,
                             PasswordEncoder passwordEncoder,
                             EmailService emailService,
                             AuditLogService auditLogService,
                             PlatformTransactionManager transactionManager) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.auditLogService = auditLogService;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    private static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPER = CHAR_LOWER.toUpperCase();
    private static final String NUMBER = "0123456789";
    private static final String PASSWORD_ALLOW_BASE = CHAR_LOWER + CHAR_UPPER + NUMBER;
    private static final SecureRandom random = new SecureRandom();

    private record PendingCredentialEmail(String email, String registerNumber, String tempPassword) {}

    public BulkImportResultDto importStudents(MultipartFile file, User adminUser) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        String filename = Optional.ofNullable(file.getOriginalFilename()).orElse("").toLowerCase();
        List<Map<String, String>> rows;

        try {
            if (filename.endsWith(".csv")) {
                rows = parseCsv(file.getInputStream());
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                rows = parseExcel(file.getInputStream());
            } else {
                throw new BadRequestException("Unsupported file type. Please upload a CSV or Excel (.xlsx) file.");
            }
        } catch (Exception e) {
            throw new BadRequestException("Failed to read file: " + e.getMessage());
        }

        int totalRecords = rows.size();
        List<ImportErrorDto> errors = new ArrayList<>();
        List<PendingCredentialEmail> pendingEmails = new ArrayList<>();

        // 1. Transactional Database Persistence
        transactionTemplate.executeWithoutResult(status -> {
            Set<String> batchEmails = new HashSet<>();
            Set<String> batchRegisterNums = new HashSet<>();
            Set<String> batchRollNums = new HashSet<>();

            for (int i = 0; i < rows.size(); i++) {
                int rowNum = i + 2; // Row number 1 is header
                Map<String, String> row = rows.get(i);

                try {
                    String name = getTrimmed(row, "Student Name", "name");
                    String email = getTrimmed(row, "Email", "email");
                    String rollNumber = getTrimmed(row, "Roll Number", "roll_number", "rollnumber");
                    String registerNumber = getTrimmed(row, "Register Number", "register_number", "reg_no", "regno");
                    String deptStr = getTrimmed(row, "Department", "department", "dept");
                    String college = getTrimmed(row, "College", "college");
                    String university = getTrimmed(row, "University", "university");
                    String batch = getTrimmed(row, "Batch", "batch");
                    String semStr = getTrimmed(row, "Semester", "semester", "current_semester");
                    String cgpaStr = getTrimmed(row, "CGPA", "cgpa");
                    String backlogsStr = getTrimmed(row, "Active Backlogs", "active_backlogs", "backlogs");
                    String address = getTrimmed(row, "Address", "address");

                    // Required field checks
                    if (isEmpty(name)) {
                        errors.add(new ImportErrorDto(rowNum, "name", "Student Name is required"));
                        continue;
                    }
                    if (isEmpty(email)) {
                        errors.add(new ImportErrorDto(rowNum, "email", "Email is required"));
                        continue;
                    }
                    if (!EmailService.isValidEmail(email)) {
                        errors.add(new ImportErrorDto(rowNum, "email", "Invalid email address format: " + email));
                        continue;
                    }
                    if (isEmpty(registerNumber)) {
                        errors.add(new ImportErrorDto(rowNum, "register_number", "Register Number is required"));
                        continue;
                    }
                    if (isEmpty(rollNumber)) {
                        errors.add(new ImportErrorDto(rowNum, "roll_number", "Roll Number is required"));
                        continue;
                    }
                    if (isEmpty(deptStr)) {
                        errors.add(new ImportErrorDto(rowNum, "department", "Department is required"));
                        continue;
                    }

                    // Duplicate checks in database & batch
                    if (userRepository.existsByEmail(email) || studentRepository.existsByEmail(email) || batchEmails.contains(email.toLowerCase())) {
                        errors.add(new ImportErrorDto(rowNum, "email", "Email already exists: " + email));
                        continue;
                    }
                    if (userRepository.existsByUsername(registerNumber.toUpperCase()) || studentRepository.existsByRegisterNumber(registerNumber) || batchRegisterNums.contains(registerNumber.toUpperCase())) {
                        errors.add(new ImportErrorDto(rowNum, "register_number", "Register Number already exists: " + registerNumber));
                        continue;
                    }
                    if (studentRepository.existsByRollNumber(rollNumber) || batchRollNums.contains(rollNumber.toUpperCase())) {
                        errors.add(new ImportErrorDto(rowNum, "roll_number", "Roll Number already exists: " + rollNumber));
                        continue;
                    }

                    // Department resolution
                    Department department = resolveDepartment(deptStr);
                    if (department == null) {
                        errors.add(new ImportErrorDto(rowNum, "department", "Department not found: " + deptStr));
                        continue;
                    }

                    // Parse numbers
                    int semester = parseInteger(semStr, 1);
                    double cgpa = parseDouble(cgpaStr, 0.0);
                    int backlogs = parseInteger(backlogsStr, 0);

                    // Generate account and temporary password
                    String tempPassword = generateTemporaryPassword();

                    User user = User.builder()
                            .username(registerNumber.toUpperCase())
                            .password(passwordEncoder.encode(tempPassword))
                            .email(email.toLowerCase())
                            .role(Role.STUDENT)
                            .status(UserStatus.ACTIVE)
                            .firstLogin(true)
                            .build();

                    User savedUser = userRepository.save(user);

                    Student student = Student.builder()
                            .user(savedUser)
                            .studentName(name)
                            .email(email.toLowerCase())
                            .rollNumber(rollNumber.toUpperCase())
                            .registerNumber(registerNumber.toUpperCase())
                            .department(department)
                            .college(isEmpty(college) ? "Engineering College" : college)
                            .university(isEmpty(university) ? "State University" : university)
                            .batch(isEmpty(batch) ? "2022-2026" : batch)
                            .currentSemester(semester)
                            .cgpa(cgpa)
                            .activeBacklogs(backlogs)
                            .address(isEmpty(address) ? null : address)
                            .build();

                    studentRepository.save(student);

                    batchEmails.add(email.toLowerCase());
                    batchRegisterNums.add(registerNumber.toUpperCase());
                    batchRollNums.add(rollNumber.toUpperCase());

                    pendingEmails.add(new PendingCredentialEmail(email.toLowerCase(), registerNumber.toUpperCase(), tempPassword));
                } catch (Exception rowEx) {
                    errors.add(new ImportErrorDto(rowNum, "general", "Error processing row: " + rowEx.getMessage()));
                }
            }
        });

        int successfulRecords = pendingEmails.size();
        int failedRecords = totalRecords - successfulRecords;

        // 2. Post-Commit Email Dispatching (DB records are safely committed)
        int emailsSubmitted = 0;
        int emailsFailed = 0;

        for (PendingCredentialEmail pending : pendingEmails) {
            try {
                boolean sent = emailService.sendStudentCredentials(pending.email(), pending.registerNumber(), pending.tempPassword());
                if (sent) {
                    emailsSubmitted++;
                } else {
                    emailsFailed++;
                    log.warn("Failed to deliver student credentials email to {} for register number {}",
                            EmailService.maskEmail(pending.email()), pending.registerNumber());
                }
            } catch (Exception mailEx) {
                emailsFailed++;
                log.error("Unexpected error while delivering student credentials email to {}: {}",
                        EmailService.maskEmail(pending.email()), mailEx.getMessage(), mailEx);
            }
        }

        auditLogService.log(adminUser, "STUDENT_BULK_IMPORT",
                String.format("Bulk imported students: Total=%d, Success=%d, Failed=%d, EmailsSubmitted=%d, EmailsFailed=%d",
                        totalRecords, successfulRecords, failedRecords, emailsSubmitted, emailsFailed));

        return BulkImportResultDto.builder()
                .totalRecords(totalRecords)
                .successfulRecords(successfulRecords)
                .failedRecords(failedRecords)
                .emailsSubmitted(emailsSubmitted)
                .emailsFailed(emailsFailed)
                .errors(errors)
                .build();
    }

    private Department resolveDepartment(String deptStr) {
        String clean = deptStr.trim();
        Optional<Department> byCode = departmentRepository.findByDepartmentCode(clean.toUpperCase());
        if (byCode.isPresent()) {
            return byCode.get();
        }
        Optional<Department> byName = departmentRepository.findByDepartmentNameIgnoreCase(clean);
        if (byName.isPresent()) {
            return byName.get();
        }

        Department newDept = Department.builder()
                .departmentCode(clean.toUpperCase().replaceAll("\\s+", "_"))
                .departmentName(clean)
                .status("ACTIVE")
                .build();
        return departmentRepository.save(newDept);
    }

    private List<Map<String, String>> parseCsv(InputStream inputStream) throws Exception {
        List<Map<String, String>> list = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
             CSVParser parser = CSVFormat.DEFAULT.builder()
                     .setHeader()
                     .setSkipHeaderRecord(true)
                     .setIgnoreSurroundingSpaces(true)
                     .setIgnoreEmptyLines(true)
                     .build()
                     .parse(reader)) {
            for (CSVRecord record : parser) {
                Map<String, String> rowMap = new HashMap<>();
                for (Map.Entry<String, String> entry : record.toMap().entrySet()) {
                    rowMap.put(entry.getKey(), entry.getValue());
                }
                list.add(rowMap);
            }
        }
        return list;
    }

    private List<Map<String, String>> parseExcel(InputStream inputStream) throws Exception {
        List<Map<String, String>> list = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) return list;

            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(getCellValueAsString(cell));
            }

            for (int r = 1; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) continue;

                Map<String, String> rowMap = new HashMap<>();
                boolean emptyRow = true;
                for (int c = 0; c < headers.size(); c++) {
                    Cell cell = row.getCell(c);
                    String val = getCellValueAsString(cell);
                    if (!isEmpty(val)) emptyRow = false;
                    rowMap.put(headers.get(c), val);
                }
                if (!emptyRow) {
                    list.add(rowMap);
                }
            }
        }
        return list;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getDateCellValue().toString();
                }
                double num = cell.getNumericCellValue();
                if (num == (long) num) {
                    yield String.valueOf((long) num);
                } else {
                    yield String.valueOf(num);
                }
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }

    private String getTrimmed(Map<String, String> map, String... keys) {
        if (map == null) return "";
        for (String key : keys) {
            for (Map.Entry<String, String> entry : map.entrySet()) {
                if (entry.getKey() != null) {
                    String cleanKey = entry.getKey().replace("\uFEFF", "").trim();
                    if (cleanKey.equalsIgnoreCase(key.trim())) {
                        return entry.getValue() != null ? entry.getValue().trim() : "";
                    }
                }
            }
        }
        return "";
    }

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    private int parseInteger(String str, int defaultVal) {
        try {
            return Integer.parseInt(str.trim());
        } catch (Exception e) {
            return defaultVal;
        }
    }

    private double parseDouble(String str, double defaultVal) {
        try {
            return Double.parseDouble(str.trim());
        } catch (Exception e) {
            return defaultVal;
        }
    }

    private String generateTemporaryPassword() {
        StringBuilder sb = new StringBuilder(8);
        sb.append("OPMS@");
        for (int i = 0; i < 4; i++) {
            int index = random.nextInt(PASSWORD_ALLOW_BASE.length());
            sb.append(PASSWORD_ALLOW_BASE.charAt(index));
        }
        return sb.toString();
    }
}
