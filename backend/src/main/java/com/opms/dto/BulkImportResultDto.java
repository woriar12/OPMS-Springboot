package com.opms.dto;

import java.util.ArrayList;
import java.util.List;

public class BulkImportResultDto {
    private int totalRecords;
    private int successfulRecords;
    private int failedRecords;
    private List<ImportErrorDto> errors = new ArrayList<>();

    public BulkImportResultDto() {
    }

    public BulkImportResultDto(int totalRecords, int successfulRecords, int failedRecords, List<ImportErrorDto> errors) {
        this.totalRecords = totalRecords;
        this.successfulRecords = successfulRecords;
        this.failedRecords = failedRecords;
        this.errors = errors != null ? errors : new ArrayList<>();
    }

    public static BulkImportResultDtoBuilder builder() {
        return new BulkImportResultDtoBuilder();
    }

    public static class BulkImportResultDtoBuilder {
        private int totalRecords;
        private int successfulRecords;
        private int failedRecords;
        private List<ImportErrorDto> errors = new ArrayList<>();

        public BulkImportResultDtoBuilder totalRecords(int totalRecords) { this.totalRecords = totalRecords; return this; }
        public BulkImportResultDtoBuilder successfulRecords(int successfulRecords) { this.successfulRecords = successfulRecords; return this; }
        public BulkImportResultDtoBuilder failedRecords(int failedRecords) { this.failedRecords = failedRecords; return this; }
        public BulkImportResultDtoBuilder errors(List<ImportErrorDto> errors) { this.errors = errors; return this; }

        public BulkImportResultDto build() {
            return new BulkImportResultDto(totalRecords, successfulRecords, failedRecords, errors);
        }
    }

    public int getTotalRecords() { return totalRecords; }
    public void setTotalRecords(int totalRecords) { this.totalRecords = totalRecords; }

    public int getSuccessfulRecords() { return successfulRecords; }
    public void setSuccessfulRecords(int successfulRecords) { this.successfulRecords = successfulRecords; }

    public int getFailedRecords() { return failedRecords; }
    public void setFailedRecords(int failedRecords) { this.failedRecords = failedRecords; }

    public List<ImportErrorDto> getErrors() { return errors; }
    public void setErrors(List<ImportErrorDto> errors) { this.errors = errors; }
}
