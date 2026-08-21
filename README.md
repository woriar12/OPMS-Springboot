# Online Placement Management System (OPMS) — Phase 1

Production-Ready **Online Placement Management System (OPMS)** full-stack application built with **Spring Boot** (Java 17), **JWT Security**, **BCrypt Password Hashing**, **MySQL / H2 Database**, and **React.js + Vite** frontend.

---

## 🚀 Key Features Implemented in Phase 1

1. **Role-Based Architecture**:
   - `ADMIN`: Full administrative control, bulk student onboarding, department setup, correction request approval, and audit logging.
   - `STUDENT`: Read-only master academic profile, self-managed career portfolio (resume, skills, GitHub/LinkedIn), discrepancy ticket submission, and first-login password update.
   - Foundation laid for `PLACEMENT_OFFICER` and `COMPANY` role extension in Phase 2.

2. **Authentication & Security**:
   - Stateless JWT-based authentication.
   - Passwords securely hashed with `BCryptPasswordEncoder`.
   - Per-request Spring Security filter with 401 Unauthorized / 403 Forbidden handling.
   - Backend enforcement preventing students from modifying master data.

3. **Student Bulk CSV/Excel Import**:
   - Accepts `.csv` and Excel (`.xlsx`, `.xls`) files.
   - Automated row-by-row validation for required fields, duplicate emails, duplicate register numbers, and department resolution.
   - Automatic student account creation (username set to Register Number) with secure temporary password generation.
   - Detailed result response with row-level error breakdown.

4. **Email Notification Engine**:
   - Automated welcome credential email dispatch via Spring Mail SMTP.
   - Graceful logger fallback if SMTP server is offline/unconfigured.

5. **First-Login Password Enforcement**:
   - Enforces password change when `first_login == true` before allowing access to student dashboard or profile.

6. **Master Data Protection & Correction Workflow**:
   - Read-only protection on Name, Register Number, Roll Number, Department, CGPA, Backlogs, College, etc.
   - Student can raise correction request tickets with current value, requested value, and reason.
   - Admin can approve (mutates master record) or reject with comments and audit logging.

7. **Dynamic Admin Dashboard**:
   - Real-time statistics fetched dynamically from Spring Boot APIs: Total Students, Total Departments, Active Accounts, Pending Correction Requests.

---

## 🛠️ Project Structure

```text
d:/project/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/opms/
│           │   ├── config/ (DataInitializer, CORS)
│           │   ├── controller/ (AuthController, AdminController, StudentController)
│           │   ├── dto/ (Auth, Student, Department, Import, Correction)
│           │   ├── entity/ (User, Department, Student, CorrectionRequest, AuditLog)
│           │   ├── exception/ (GlobalExceptionHandler)
│           │   ├── repository/ (Spring Data JPA Repositories)
│           │   ├── security/ (JwtTokenProvider, JwtAuthenticationFilter, SecurityConfig)
│           │   └── service/ (Auth, Student, Department, BulkImport, Email, Correction)
│           └── resources/
│               └── application.yml (MySQL & H2 profiles, JWT, Mail)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── context/ (AuthContext)
│       ├── layouts/ (AdminLayout, StudentLayout)
│       ├── pages/ (LoginPage, AdminDashboard, BulkImport, Departments, StudentList, Corrections, Profile)
│       ├── routes/ (AppRoutes, ProtectedRoute)
│       └── services/ (apiClient, authService, adminService, studentService)
└── sample_students.csv
```

---

## 🔑 Default Credentials (Seeded Automatically)

| Role | Username / Reg No | Password | Description |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `Admin@12345` | Default Super Admin Account |
| **STUDENT** | `24CS001` *(after bulk import)* | Generated / `OPMS@a1b2` | Student Account (First Login required) |

---

## ⚙️ Setup & Execution Instructions

### 1. Database Configuration

- **MySQL Mode (Default Profile `prod`)**:
  Create MySQL database `opms_db` or let Hibernate create it automatically:
  ```sql
  CREATE DATABASE IF NOT EXISTS opms_db;
  ```
  Configure credentials in `backend/src/main/resources/application.yml` or set environment variables:
  ```env
  SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/opms_db
  SPRING_DATASOURCE_USERNAME=root
  SPRING_DATASOURCE_PASSWORD=root
  ```

- **H2 In-Memory Mode (`dev` profile for instant zero-dependency testing)**:
  Run backend with `-Dspring.profiles.active=dev` or set `spring.profiles.active: dev` in `application.yml`. Access H2 Console at `http://localhost:8080/h2-console` (`JDBC URL: jdbc:h2:mem:opms_db`, Username: `sa`, Password: `password`).

### 2. Starting Backend (Spring Boot)

Navigate to `backend` directory and compile/run:

```bash
cd d:\project\backend
mvn clean spring-boot:run
```
The server will start on port `8080` (Base URL: `http://localhost:8080`).

### 3. Starting Frontend (React + Vite)

Navigate to `frontend` directory, install dependencies, and start dev server:

```bash
cd d:\project\frontend
npm install
npm run dev
```
The Vite server will start on port `5173` (`http://localhost:5173`). API requests to `/api/*` are proxied to `http://localhost:8080`.

---

## 📡 Key REST API Endpoints

### Auth APIs
- `POST /api/auth/login` — Authenticate user, return JWT token & role.
- `GET /api/auth/me` — Fetch current user details.
- `POST /api/auth/change-password` — Change user/student password (sets `first_login=false`).
- `POST /api/auth/logout` — Logout user.

### Admin APIs (`ROLE_ADMIN`)
- `GET /api/admin/dashboard/stats` — Real-time metrics.
- `GET /api/admin/departments` — List departments.
- `POST /api/admin/departments` — Create new department code/name.
- `POST /api/admin/students/import` — Upload CSV or Excel file for bulk student creation.
- `GET /api/admin/students/sample-import-template` — Download sample CSV template.
- `GET /api/admin/students` — List students with department & search filters.
- `GET /api/admin/correction-requests` — List all student discrepancy requests.
- `POST /api/admin/correction-requests/{id}/approve` — Approve request & mutate master data.
- `POST /api/admin/correction-requests/{id}/reject` — Reject request with admin comment.
- `GET /api/admin/audit-logs` — Fetch audit trail logs.

### Student APIs (`ROLE_STUDENT`)
- `GET /api/student/profile` — View read-only master profile + career profile.
- `PUT /api/student/career-profile` — Update career profile (skills, resume, GitHub, LinkedIn).
- `POST /api/student/correction-requests` — Submit master data correction request.
- `GET /api/student/correction-requests` — Track submitted requests and admin feedback.

---

## 🧪 End-to-End Testing Walkthrough

1. Open `http://localhost:5173/login`. Click **Fill Admin** to populate `admin` / `Admin@12345`.
2. Login to access **Admin Dashboard**. Observe dynamic counter cards.
3. Click **Bulk Import** on the sidebar.
4. Click **Download Sample Template (.CSV)** or select `sample_students.csv` from `d:/project/sample_students.csv`.
5. Click **Import & Generate Accounts**. Observe the validation summary showing total, successful, and failed counts.
6. Copy the register number of an imported student (e.g., `24CS001`) and the temporary password displayed in the backend logs or email output.
7. Logout as Admin and login as Student (`24CS001`).
8. System automatically enforces **First Login Password Change**. Enter old password and set a new password.
9. System redirects to **Student Dashboard**. Navigate to **Profile** to verify master data is READ-ONLY and update skills/resume links.
10. Navigate to **Correction Request** and submit a ticket (e.g., request department change from `ECE` to `CSE`).
11. Log back in as Admin, navigate to **Correction Requests**, and click **Approve**.
12. Log back in as Student to confirm master data has been updated seamlessly.
#   O P M S - S p r i n g b o o t  
 