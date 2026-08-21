package com.opms.service;

import com.opms.dto.AuditLogDto;
import com.opms.entity.AuditLog;
import com.opms.entity.User;
import com.opms.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void log(User user, String action, String description) {
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .description(description)
                .build();
        auditLogRepository.save(auditLog);
    }

    @Transactional(readOnly = true)
    public List<AuditLogDto> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc()
                .stream()
                .map(log -> AuditLogDto.builder()
                        .id(log.getId())
                        .username(log.getUser() != null ? log.getUser().getUsername() : "SYSTEM")
                        .action(log.getAction())
                        .description(log.getDescription())
                        .timestamp(log.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }
}
