package com.opms.dto;

public class ImportErrorDto {
    private int row;
    private String field;
    private String message;

    public ImportErrorDto() {
    }

    public ImportErrorDto(int row, String field, String message) {
        this.row = row;
        this.field = field;
        this.message = message;
    }

    public static ImportErrorDtoBuilder builder() {
        return new ImportErrorDtoBuilder();
    }

    public static class ImportErrorDtoBuilder {
        private int row;
        private String field;
        private String message;

        public ImportErrorDtoBuilder row(int row) { this.row = row; return this; }
        public ImportErrorDtoBuilder field(String field) { this.field = field; return this; }
        public ImportErrorDtoBuilder message(String message) { this.message = message; return this; }

        public ImportErrorDto build() {
            return new ImportErrorDto(row, field, message);
        }
    }

    public int getRow() { return row; }
    public void setRow(int row) { this.row = row; }

    public String getField() { return field; }
    public void setField(String field) { this.field = field; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
