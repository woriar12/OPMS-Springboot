package com.opms.service;

import com.opms.dto.PlacementOfficerDto;
import com.opms.entity.*;
import com.opms.exception.BadRequestException;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.PlacementOfficerRepository;
import com.opms.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlacementOfficerService {

    private final PlacementOfficerRepository officerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PlacementOfficerService(PlacementOfficerRepository officerRepository,
                                   UserRepository userRepository,
                                   PasswordEncoder passwordEncoder) {
        this.officerRepository = officerRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public PlacementOfficerDto createOfficer(PlacementOfficerDto dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new BadRequestException("Username already exists: " + dto.getUsername());
        }
        if (dto.getEmail() != null && userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already exists: " + dto.getEmail());
        }

        String tempPassword = dto.getEmployeeId() != null ? "Officer@" + dto.getEmployeeId() : "Officer@12345";

        User user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(tempPassword))
                .email(dto.getEmail())
                .role(Role.PLACEMENT_OFFICER)
                .status(UserStatus.ACTIVE)
                .firstLogin(true)
                .build();
        User savedUser = userRepository.save(user);

        PlacementOfficer officer = PlacementOfficer.builder()
                .user(savedUser)
                .fullName(dto.getFullName())
                .employeeId(dto.getEmployeeId())
                .phone(dto.getPhone())
                .department(dto.getDepartment())
                .build();

        PlacementOfficer saved = officerRepository.save(officer);
        PlacementOfficerDto result = mapToDto(saved);
        result.setStatus(savedUser.getStatus().name());
        return result;
    }

    @Transactional(readOnly = true)
    public List<PlacementOfficerDto> getAllOfficers() {
        return officerRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlacementOfficerDto getOfficerById(Long id) {
        PlacementOfficer officer = officerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + id));
        return mapToDto(officer);
    }

    @Transactional(readOnly = true)
    public PlacementOfficerDto getMyProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        PlacementOfficer officer = officerRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Officer profile not found"));
        return mapToDto(officer);
    }

    @Transactional
    public PlacementOfficerDto updateOfficer(Long id, PlacementOfficerDto dto) {
        PlacementOfficer officer = officerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + id));
        if (dto.getFullName() != null) officer.setFullName(dto.getFullName());
        if (dto.getPhone() != null) officer.setPhone(dto.getPhone());
        if (dto.getDepartment() != null) officer.setDepartment(dto.getDepartment());
        PlacementOfficer updated = officerRepository.save(officer);
        return mapToDto(updated);
    }

    @Transactional
    public PlacementOfficerDto updateStatus(Long id, String status) {
        PlacementOfficer officer = officerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found with id: " + id));
        User user = officer.getUser();
        user.setStatus(UserStatus.valueOf(status.toUpperCase()));
        userRepository.save(user);
        return mapToDto(officer);
    }

    public PlacementOfficerDto mapToDto(PlacementOfficer officer) {
        return PlacementOfficerDto.builder()
                .id(officer.getId())
                .userId(officer.getUser().getId())
                .username(officer.getUser().getUsername())
                .email(officer.getUser().getEmail())
                .fullName(officer.getFullName())
                .employeeId(officer.getEmployeeId())
                .phone(officer.getPhone())
                .department(officer.getDepartment())
                .status(officer.getUser().getStatus().name())
                .createdAt(officer.getCreatedAt())
                .build();
    }
}
