package com.opms.config;

import org.hibernate.dialect.MySQLDialect;
import java.sql.Types;

/**
 * Custom MySQL Dialect to ensure compatibility with older MySQL versions (5.5+).
 * Overrides datetime(6) → datetime to avoid fractional seconds precision error.
 */
public class CustomMySQLDialect extends MySQLDialect {

    @Override
    public String columnType(int sqlTypeCode) {
        // Remove fractional seconds precision — compatible with all MySQL 5.5+ versions
        if (sqlTypeCode == Types.TIMESTAMP || sqlTypeCode == Types.TIMESTAMP_WITH_TIMEZONE) {
            return "datetime";
        }
        if (sqlTypeCode == Types.TIME) {
            return "time";
        }
        return super.columnType(sqlTypeCode);
    }
}
