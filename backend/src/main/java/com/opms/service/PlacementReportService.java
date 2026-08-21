package com.opms.service;

import com.opms.dto.*;
import com.opms.entity.*;
import com.opms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlacementReportService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final OfferRepository offerRepository;
    private final PlacementRepository placementRepository;

    public PlacementReportService(StudentRepository studentRepository,
                                  DepartmentRepository departmentRepository,
                                  CompanyRepository companyRepository,
                                  PlacementDriveRepository driveRepository,
                                  ApplicationRepository applicationRepository,
                                  InterviewRepository interviewRepository,
                                  OfferRepository offerRepository,
                                  PlacementRepository placementRepository) {
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
        this.offerRepository = offerRepository;
        this.placementRepository = placementRepository;
    }

    @Transactional(readOnly = true)
    public OverallPlacementReportDto getOverallReport() {
        long totalStudents = studentRepository.count();
        long totalCompanies = companyRepository.count();
        long totalDrives = driveRepository.count();
        long totalApplications = applicationRepository.count();

        List<Application> allApps = applicationRepository.findAll();
        long shortlisted = allApps.stream().filter(a -> a.getStatus() == ApplicationStatus.SHORTLISTED
                || a.getStatus() == ApplicationStatus.INTERVIEW_SCHEDULED
                || a.getStatus() == ApplicationStatus.INTERVIEWED
                || a.getStatus() == ApplicationStatus.SELECTED
                || a.getStatus() == ApplicationStatus.OFFERED
                || a.getStatus() == ApplicationStatus.OFFER_ACCEPTED
                || a.getStatus() == ApplicationStatus.PLACED).count();

        long interviews = interviewRepository.count();
        long selected = allApps.stream().filter(a -> a.getStatus() == ApplicationStatus.SELECTED
                || a.getStatus() == ApplicationStatus.OFFERED
                || a.getStatus() == ApplicationStatus.OFFER_ACCEPTED
                || a.getStatus() == ApplicationStatus.PLACED).count();

        long offers = offerRepository.count();
        long placed = placementRepository.count();
        long unplaced = Math.max(0, totalStudents - placed);

        double percentage = totalStudents > 0 ? ((double) placed / totalStudents) * 100.0 : 0.0;

        OverallPlacementReportDto report = new OverallPlacementReportDto();
        report.setTotalStudents(totalStudents);
        report.setTotalCompanies(totalCompanies);
        report.setTotalDrives(totalDrives);
        report.setTotalApplications(totalApplications);
        report.setTotalShortlisted(shortlisted);
        report.setTotalInterviews(interviews);
        report.setTotalSelected(selected);
        report.setTotalOffers(offers);
        report.setTotalPlaced(placed);
        report.setTotalUnplaced(unplaced);
        report.setPlacementPercentage(Math.round(percentage * 100.0) / 100.0);

        return report;
    }

    @Transactional(readOnly = true)
    public List<DepartmentPlacementReportDto> getDepartmentReports() {
        List<Department> departments = departmentRepository.findAll();
        List<DepartmentPlacementReportDto> result = new ArrayList<>();

        for (Department dept : departments) {
            List<Student> students = studentRepository.findAll().stream()
                    .filter(s -> s.getDepartment() != null && s.getDepartment().getId().equals(dept.getId()))
                    .toList();

            long totalStudents = students.size();
            long placedStudents = placementRepository.countByDepartment(dept);
            double percentage = totalStudents > 0 ? ((double) placedStudents / totalStudents) * 100.0 : 0.0;

            DepartmentPlacementReportDto dto = new DepartmentPlacementReportDto();
            dto.setDepartmentId(dept.getId());
            dto.setDepartmentCode(dept.getDepartmentCode());
            dto.setDepartmentName(dept.getDepartmentName());
            dto.setTotalStudents(totalStudents);
            dto.setPlacedStudents(placedStudents);
            dto.setPlacementPercentage(Math.round(percentage * 100.0) / 100.0);

            result.add(dto);
        }

        return result;
    }

    @Transactional(readOnly = true)
    public String exportPlacementCsv() {
        StringBuilder csv = new StringBuilder();
        csv.append("Student Name,Register Number,Department,Company,Role,Package (LPA),Placement Date\n");

        List<Placement> placements = placementRepository.findAllByOrderByPlacementDateDesc();
        for (Placement p : placements) {
            csv.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f,\"%s\"\n",
                    p.getStudent().getStudentName(),
                    p.getStudent().getRegisterNumber(),
                    p.getStudent().getDepartment() != null ? p.getStudent().getDepartment().getDepartmentCode() : "",
                    p.getCompany().getCompanyName(),
                    p.getJobRole(),
                    p.getPackageAmount(),
                    p.getPlacementDate()));
        }

        return csv.toString();
    }
}
