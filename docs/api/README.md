# Smart Campus ERP API Documentation

## Base URL

```
Development: http://localhost:4000/api/v1
Production: https://your-domain.com/api/v1
```

## Authentication

All API requests (except public endpoints) require a Bearer JWT token in the Authorization header.

```
Authorization: Bearer <access_token>
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | User login | Public |
| POST | `/auth/register` | User registration | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Logout user | Protected |
| GET | `/auth/profile` | Get current user profile | Protected |
| POST | `/auth/verify-email` | Verify email address | Public |
| POST | `/auth/forgot-password` | Request password reset | Public |
| POST | `/auth/reset-password` | Reset password with token | Public |
| POST | `/auth/change-password` | Change password | Protected |
| POST | `/auth/2fa/generate` | Generate 2FA secret | Protected |
| POST | `/auth/2fa/enable` | Enable 2FA | Protected |
| POST | `/auth/2fa/disable` | Disable 2FA | Protected |

## User Management

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/users` | Create user | SUPER_ADMIN, REGISTRAR |
| GET | `/users` | List all users | SUPER_ADMIN, REGISTRAR, ACADEMIC_OFFICE |
| GET | `/users/profile` | Get current user | Protected |
| GET | `/users/stats` | User statistics | SUPER_ADMIN, CHANCELLOR, REGISTRAR |
| GET | `/users/search` | Search users | Protected |
| GET | `/users/:id` | Get user by ID | SUPER_ADMIN, REGISTRAR, ACADEMIC_OFFICE |
| PATCH | `/users/:id` | Update user | SUPER_ADMIN, REGISTRAR |
| DELETE | `/users/:id` | Deactivate user | SUPER_ADMIN |
| POST | `/users/:id/roles/:role` | Assign role | SUPER_ADMIN, REGISTRAR |
| DELETE | `/users/:id/roles/:role` | Remove role | SUPER_ADMIN, REGISTRAR |

## Students

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/students` | Create student | SUPER_ADMIN, REGISTRAR, ADMISSION_OFFICE |
| GET | `/students` | List students | Multiple roles |
| GET | `/students/dashboard` | Student dashboard | STUDENT |
| GET | `/students/my-profile` | My profile | STUDENT |
| GET | `/students/my-attendance` | My attendance | STUDENT |
| GET | `/students/my-results` | My results | STUDENT |
| GET | `/students/my-fees` | My fees | STUDENT |
| GET | `/students/:id` | Get student | Multiple roles |
| GET | `/students/user/:userId` | Get by user ID | SUPER_ADMIN, REGISTRAR |
| PATCH | `/students/:id` | Update student | SUPER_ADMIN, REGISTRAR, ADMISSION_OFFICE |
| DELETE | `/students/:id` | Deactivate student | SUPER_ADMIN, REGISTRAR |
| POST | `/students/bulk-enroll` | Bulk enroll | SUPER_ADMIN, ADMISSION_OFFICE |
| GET | `/students/:id/attendance` | Student attendance | Multiple roles |
| GET | `/students/:id/results` | Student results | Multiple roles |
| GET | `/students/:id/fees` | Student fees | Multiple roles |

## Faculty

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/faculty` | Create faculty | SUPER_ADMIN, REGISTRAR, ACADEMIC_OFFICE |
| GET | `/faculty` | List faculty | Multiple roles |
| GET | `/faculty/dashboard` | Faculty dashboard | FACULTY, ADMIN |
| GET | `/faculty/my-profile` | My profile | FACULTY |
| GET | `/faculty/my-courses` | My courses | FACULTY |
| GET | `/faculty/analytics` | Faculty analytics | SUPER_ADMIN, CHANCELLOR |
| GET | `/faculty/:id` | Get faculty | Multiple roles |
| PATCH | `/faculty/:id` | Update faculty | SUPER_ADMIN, REGISTRAR |
| DELETE | `/faculty/:id` | Deactivate | SUPER_ADMIN, REGISTRAR |
| GET | `/faculty/:id/attendance` | Faculty attendance | Multiple roles |
| GET | `/faculty/:id/research` | Faculty research | Multiple roles |
| GET | `/faculty/:id/publications` | Faculty publications | Multiple roles |
| POST | `/faculty/:facultyId/courses/:subjectId` | Assign course | SUPER_ADMIN, REGISTRAR |
| DELETE | `/faculty/:facultyId/courses/:subjectId` | Remove course | SUPER_ADMIN, REGISTRAR |

## Departments

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/departments` | Create department | SUPER_ADMIN, REGISTRAR, ACADEMIC_OFFICE |
| GET | `/departments` | List departments | Leadership, academic |
| GET | `/departments/:id` | Get department | Leadership, academic |
| PATCH | `/departments/:id` | Update department | SUPER_ADMIN, REGISTRAR |
| DELETE | `/departments/:id` | Delete department | SUPER_ADMIN, REGISTRAR |
| POST | `/departments/:id/set-hod/:facultyId` | Set HOD | SUPER_ADMIN, REGISTRAR |
| GET | `/departments/:id/faculty` | Department faculty | Leadership, HOD |
| GET | `/departments/:id/students` | Department students | Leadership, faculty |
| GET | `/departments/:id/courses` | Department courses | Leadership, faculty |
| GET | `/departments/:id/stats` | Department stats | Leadership, HOD |

## Courses

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/courses` | Create course | SUPER_ADMIN, ACADEMIC_OFFICE |
| GET | `/courses` | List courses | Multiple roles |
| GET | `/courses/:id` | Get course | Multiple roles |
| PATCH | `/courses/:id` | Update course | SUPER_ADMIN, ACADEMIC_OFFICE |
| DELETE | `/courses/:id` | Delete course | SUPER_ADMIN |
| GET | `/courses/:id/subjects` | Course subjects | Multiple roles |
| GET | `/courses/:id/batches` | Course batches | Multiple roles |
| GET | `/courses/:id/sections` | Course sections | Multiple roles |
| POST | `/courses/:courseId/subjects` | Add subject | SUPER_ADMIN, ACADEMIC_OFFICE |
| POST | `/courses/:courseId/batches` | Add batch | SUPER_ADMIN, ACADEMIC_OFFICE |

## Attendance

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/attendance` | Mark attendance | FACULTY |
| POST | `/attendance/bulk` | Bulk mark attendance | FACULTY |
| GET | `/attendance` | List attendance | Multiple roles |
| GET | `/attendance/stats` | Attendance stats | Multiple roles |
| GET | `/attendance/student/:studentId` | Student attendance | Multiple roles |
| GET | `/attendance/subject/:subjectId` | Subject attendance | Multiple roles |
| GET | `/attendance/date-range` | Date range query | Multiple roles |
| GET | `/attendance/report` | Attendance report | ADMIN |
| PATCH | `/attendance/:id` | Update attendance | FACULTY |
| DELETE | `/attendance/:id` | Delete attendance | ADMIN |

## Exams & Results

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/exams` | Create exam | EXAMINATION_DEPT, FACULTY |
| GET | `/exams` | List exams | Multiple roles |
| GET | `/exams/:id` | Get exam | Multiple roles |
| PATCH | `/exams/:id` | Update exam | EXAMINATION_DEPT, FACULTY |
| DELETE | `/exams/:id` | Delete exam | EXAMINATION_DEPT |
| GET | `/exams/upcoming` | Upcoming exams | Multiple roles |
| GET | `/exams/subject/:subjectId` | Subject exams | Multiple roles |
| POST | `/exams/:examId/results` | Add results | FACULTY, EXAMINATION_DEPT |
| GET | `/exams/:examId/results` | Exam results | Multiple roles |
| PATCH | `/exams/results/:resultId` | Update result | FACULTY |
| POST | `/exams/:examId/publish` | Publish results | EXAMINATION_DEPT |
| GET | `/exams/results/student/:studentId` | Student results | Multiple roles |
| GET | `/exams/transcript/:studentId` | Transcript | REGISTRAR, STUDENT |
| GET | `/exams/grade-card/:studentId/:semester` | Grade card | Multiple roles |

## Fees & Payments

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/fees/structures` | Create fee structure | FINANCE |
| GET | `/fees/structures` | List fee structures | FINANCE, ADMIN |
| GET | `/fees/structures/:id` | Get fee structure | FINANCE |
| PATCH | `/fees/structures/:id` | Update fee structure | FINANCE |
| DELETE | `/fees/structures/:id` | Delete fee structure | FINANCE |
| POST | `/fees/accounts` | Create fee account | FINANCE |
| GET | `/fees/accounts` | List fee accounts | FINANCE, ADMIN |
| GET | `/fees/accounts/student/:studentId` | Student fees | Multiple roles |
| GET | `/fees/accounts/:id` | Get fee account | FINANCE |
| PATCH | `/fees/accounts/:id` | Update fee account | FINANCE |
| POST | `/fees/payments` | Record payment | FINANCE |
| GET | `/fees/payments` | List payments | FINANCE, ADMIN |
| GET | `/fees/payments/:id` | Get payment | FINANCE |
| POST | `/fees/payments/:id/verify` | Verify payment | FINANCE |
| GET | `/fees/dashboard` | Fee dashboard | FINANCE |
| GET | `/fees/reports/collection` | Collection report | FINANCE |
| GET | `/fees/reports/pending` | Pending dues | FINANCE |

## Hostel

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/hostel` | Create hostel | HOSTEL_OFFICE, SUPER_ADMIN |
| GET | `/hostel` | List hostels | Multiple roles |
| GET | `/hostel/:id` | Get hostel | Multiple roles |
| PATCH | `/hostel/:id` | Update hostel | HOSTEL_OFFICE |
| DELETE | `/hostel/:id` | Delete hostel | HOSTEL_OFFICE |
| POST | `/hostel/:hostelId/floors` | Add floor | HOSTEL_OFFICE |
| GET | `/hostel/:hostelId/floors` | List floors | Multiple roles |
| POST | `/hostel/:hostelId/rooms` | Add room | HOSTEL_OFFICE |
| GET | `/hostel/:hostelId/rooms` | List rooms | Multiple roles |
| GET | `/hostel/rooms/available` | Available rooms | Multiple roles |
| PATCH | `/hostel/rooms/:id` | Update room | HOSTEL_OFFICE |
| POST | `/hostel/allocate` | Allocate room | HOSTEL_OFFICE |
| GET | `/hostel/allocations` | List allocations | HOSTEL_OFFICE, ADMIN |
| GET | `/hostel/allocations/student/:studentId` | Student allocation | Multiple roles |
| PATCH | `/hostel/allocations/:id/checkout` | Checkout | HOSTEL_OFFICE |
| GET | `/hostel/dashboard` | Hostel dashboard | HOSTEL_OFFICE, ADMIN |

## Library

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/library/items` | Add library item | LIBRARY_STAFF |
| GET | `/library/items` | List items | Multiple roles |
| GET | `/library/items/:id` | Get item | Multiple roles |
| PATCH | `/library/items/:id` | Update item | LIBRARY_STAFF |
| DELETE | `/library/items/:id` | Delete item | LIBRARY_STAFF |
| GET | `/library/items/search` | Search items | Multiple roles |
| POST | `/library/items/:itemId/issue` | Issue item | LIBRARY_STAFF |
| POST | `/library/items/:itemId/return` | Return item | LIBRARY_STAFF |
| GET | `/library/issues` | List issues | LIBRARY_STAFF, ADMIN |
| GET | `/library/issues/user/:userId` | User issues | Multiple roles |
| GET | `/library/issues/overdue` | Overdue items | LIBRARY_STAFF |
| GET | `/library/dashboard` | Library dashboard | LIBRARY_STAFF, ADMIN |
| POST | `/library/items/:itemId/reserve` | Reserve item | Multiple roles |

## HR & Payroll

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/hr/employees` | Create employee | SUPER_ADMIN, HR |
| GET | `/hr/employees` | List employees | HR, ADMIN |
| GET | `/hr/employees/:id` | Get employee | HR, ADMIN |
| PATCH | `/hr/employees/:id` | Update employee | HR |
| DELETE | `/hr/employees/:id` | Deactivate | HR |
| GET | `/hr/dashboard` | HR dashboard | HR, ADMIN |
| GET | `/hr/employees/search` | Search employees | HR |
| POST | `/payroll` | Create payroll | FINANCE, HR |
| GET | `/payroll` | List payrolls | FINANCE, HR, ADMIN |
| GET | `/payroll/:id` | Get payroll | FINANCE, HR |
| PATCH | `/payroll/:id` | Update payroll | FINANCE |
| POST | `/payroll/process` | Process payroll | FINANCE |
| POST | `/payroll/:id/mark-paid` | Mark as paid | FINANCE |
| GET | `/payroll/employee/:employeeId` | Employee payroll | FINANCE, HR |
| GET | `/payroll/summary` | Payroll summary | FINANCE, ADMIN |

## Leave Management

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/leave` | Apply leave | Protected |
| GET | `/leave` | List leaves | ADMIN, HR |
| GET | `/leave/:id` | Get leave | Protected |
| PATCH | `/leave/:id` | Update leave | Protected |
| DELETE | `/leave/:id` | Cancel leave | Protected |
| POST | `/leave/:id/approve` | Approve leave | ADMIN, HOD |
| POST | `/leave/:id/reject` | Reject leave | ADMIN, HOD |
| GET | `/leave/my-leaves` | My leaves | Protected |
| GET | `/leave/balance` | Leave balance | Protected |
| GET | `/leave/pending` | Pending approvals | ADMIN, HOD |
| GET | `/leave/calendar` | Leave calendar | ADMIN |

## Complaints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/complaints` | Create complaint | Protected |
| GET | `/complaints` | List complaints | ADMIN, SUPPORT |
| GET | `/complaints/:id` | Get complaint | Protected |
| PATCH | `/complaints/:id` | Update complaint | Protected |
| DELETE | `/complaints/:id` | Delete complaint | ADMIN |
| POST | `/complaints/:id/assign` | Assign complaint | ADMIN |
| POST | `/complaints/:id/resolve` | Resolve complaint | ADMIN, SUPPORT |
| POST | `/complaints/:id/escalate` | Escalate complaint | Protected |
| POST | `/complaints/:id/feedback` | Add feedback | Protected |
| GET | `/complaints/dashboard` | Complaints dashboard | ADMIN |

## AI & Chatbot

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/ai/chat` | Ask AI question | Protected |
| POST | `/ai/chat/:sessionId` | Continue conversation | Protected |
| GET | `/ai/chat/history` | Chat history | Protected |
| DELETE | `/ai/chat/:sessionId` | Clear conversation | Protected |
| POST | `/ai/generate/document` | Generate document | Protected |
| POST | `/ai/generate/letter` | Generate letter | Protected |
| POST | `/ai/search` | Semantic search | Protected |
| POST | `/ai/embed` | Generate embeddings | Protected |
| POST | `/ai/knowledge-base` | Add to KB | ADMIN |
| GET | `/ai/knowledge-base` | List KB | ADMIN |
| GET | `/ai/knowledge-base/:id` | Get KB entry | ADMIN |
| PATCH | `/ai/knowledge-base/:id` | Update KB | ADMIN |
| DELETE | `/ai/knowledge-base/:id` | Delete KB | ADMIN |
| GET | `/ai/dashboard` | AI usage stats | ADMIN |
| POST | `/ai/templates` | Create template | ADMIN |
| GET | `/ai/templates` | List templates | ADMIN |
| POST | `/chatbot/message` | Send chatbot message | Protected |
| GET | `/chatbot/conversations` | List conversations | Protected |
| GET | `/chatbot/conversations/:sessionId/messages` | Conversation messages | Protected |
| DELETE | `/chatbot/conversations/:sessionId` | Delete conversation | Protected |
| POST | `/chatbot/feedback` | Rate response | Protected |
| GET | `/chatbot/faq` | Get FAQ suggestions | Public |
| POST | `/chatbot/escalate` | Escalate to human | Protected |

## Standard Query Parameters

### Pagination
```
?page=1&limit=20&sortBy=createdAt&sortOrder=desc
```

### Search
```
?search=keyword
```

### Filtering
```
?status=ACTIVE&departmentId=uuid&courseId=uuid
```

### Date Range
```
?fromDate=2024-01-01&toDate=2024-12-31
```

## Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": ["Validation error message"],
  "error": "Bad Request",
  "path": "/api/v1/resource",
  "method": "POST",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:4000', {
  auth: { token: 'Bearer <jwt_token>' }
});
```

### Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `notification` | Server → Client | New notification |
| `chat:message` | Bidirectional | Chat message |
| `attendance:update` | Server → Client | Attendance updated |
| `announcement` | Server → Client | New announcement |
| `event:reminder` | Server → Client | Event reminder |
| `fee:reminder` | Server → Client | Fee due reminder |

## Rate Limiting

- Default: 100 requests per 60 seconds per IP
- Auth endpoints: 10 requests per minute
- File upload: 20 requests per minute

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate entry |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
