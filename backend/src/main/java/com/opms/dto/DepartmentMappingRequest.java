package com.opms.dto;

import java.util.List;

public class DepartmentMappingRequest {
    private List<Long> departmentIds;

    public DepartmentMappingRequest() {
    }

    public DepartmentMappingRequest(List<Long> departmentIds) {
        this.departmentIds = departmentIds;
    }

    public List<Long> getDepartmentIds() {
        return departmentIds;
    }

    public void setDepartmentIds(List<Long> departmentIds) {
        this.departmentIds = departmentIds;
    }
}
