package com.opms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "placement_drive_departments",
       uniqueConstraints = @UniqueConstraint(columnNames = {"drive_id", "department_id"}))
public class PlacementDriveDepartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drive_id", nullable = false)
    private PlacementDrive drive;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    public PlacementDriveDepartment() {}

    public PlacementDriveDepartment(PlacementDrive drive, Department department) {
        this.drive = drive;
        this.department = department;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public PlacementDrive getDrive() { return drive; }
    public void setDrive(PlacementDrive drive) { this.drive = drive; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
}
