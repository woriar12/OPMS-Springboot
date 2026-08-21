package com.opms.service;

import com.opms.dto.AuthResponse;
import com.opms.dto.ChangePasswordRequest;
import com.opms.dto.LoginRequest;
import com.opms.entity.Student;
import com.opms.entity.User;
import com.opms.exception.BadRequestException;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.StudentRepository;
import com.opms.repository.UserRepository;
import com.opms.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, StudentRepository studentRepository, JwtTokenProvider tokenProvider, PasswordEncoder passwordEncoder, AuditLogService auditLogService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .or(() -> userRepository.findByEmail(loginRequest.getUsername()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String studentName = null;
        String registerNumber = null;

        if (user.getRole().name().equals("STUDENT")) {
            Optional<Student> studentOpt = studentRepository.findByUser(user);
            if (studentOpt.isPresent()) {
                studentName = studentOpt.get().getStudentName();
                registerNumber = studentOpt.get().getRegisterNumber();
            }
        }

        auditLogService.log(user, "USER_LOGIN", "User logged in successfully");

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .firstLogin(user.getFirstLogin())
                .studentName(studentName)
                .registerNumber(registerNumber)
                .build();
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setFirstLogin(false);
        userRepository.save(user);

        auditLogService.log(user, "PASSWORD_CHANGE", "User changed password successfully");
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String studentName = null;
        String registerNumber = null;

        if (user.getRole().name().equals("STUDENT")) {
            Optional<Student> studentOpt = studentRepository.findByUser(user);
            if (studentOpt.isPresent()) {
                studentName = studentOpt.get().getStudentName();
                registerNumber = studentOpt.get().getRegisterNumber();
            }
        }

        return AuthResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .firstLogin(user.getFirstLogin())
                .studentName(studentName)
                .registerNumber(registerNumber)
                .build();
    }
}
