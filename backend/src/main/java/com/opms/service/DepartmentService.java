package com.opms.service;

import com.opms.dto.DepartmentDto;
import com.opms.entity.Department;
import com.opms.exception.BadRequestException;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentDto getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return mapToDto(dept);
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentDto dto) {
        String code = dto.getDepartmentCode().toUpperCase().trim();
        if (departmentRepository.existsByDepartmentCode(code)) {
            throw new BadRequestException("Department code already exists: " + code);
        }

        Department dept = Department.builder()
                .departmentCode(code)
                .departmentName(dto.getDepartmentName().trim())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();

        Department saved = departmentRepository.save(dept);
        return mapToDto(saved);
    }

    @Transactional
    public DepartmentDto updateDepartment(Long id, DepartmentDto dto) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        String newCode = dto.getDepartmentCode().toUpperCase().trim();
        if (!dept.getDepartmentCode().equalsIgnoreCase(newCode) && departmentRepository.existsByDepartmentCode(newCode)) {
            throw new BadRequestException("Department code already exists: " + newCode);
        }

        dept.setDepartmentCode(newCode);
        dept.setDepartmentName(dto.getDepartmentName().trim());
        if (dto.getStatus() != null) {
            dept.setStatus(dto.getStatus());
        }

        Department updated = departmentRepository.save(dept);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        departmentRepository.delete(dept);
    }

    private DepartmentDto mapToDto(Department dept) {
        return DepartmentDto.builder()
                .id(dept.getId())
                .departmentCode(dept.getDepartmentCode())
                .departmentName(dept.getDepartmentName())
                .status(dept.getStatus())
                .createdAt(dept.getCreatedAt())
                .updatedAt(dept.getUpdatedAt())
                .build();
    }
}
