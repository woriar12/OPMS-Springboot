package com.opms.controller;

import com.opms.dto.CompanyDto;
import com.opms.dto.CompanyRegistrationRequest;
import com.opms.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/companies")
public class CompanyRegistrationController {

    private final CompanyService companyService;

    public CompanyRegistrationController(CompanyService companyService) {
        this.companyService = companyService;
    }

    /**
     * PUBLIC endpoint — no authentication required.
     * Company submits registration form.
     */
    @PostMapping("/register")
    public ResponseEntity<CompanyDto> registerCompany(@Valid @RequestBody CompanyRegistrationRequest request) {
        CompanyDto result = companyService.registerCompany(request);
        return ResponseEntity.status(201).body(result);
    }

    @GetMapping("/register/check-name")
    public ResponseEntity<Map<String, Boolean>> checkCompanyName(@RequestParam String name) {
        boolean exists = companyService.getAllCompanies().stream()
                .anyMatch(c -> c.getCompanyName().equalsIgnoreCase(name));
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}
