# Smart Campus ERP - Architecture Overview

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────────┐   │
│  │   Web Browser    │  │   Mobile App    │  │   Third-Party     │   │
│  │   (Next.js)      │  │   (PWA)         │  │   Integrations    │   │
│  └────────┬─────────┘  └────────┬────────┘  └────────┬──────────┘   │
│           │                     │                     │              │
│  ┌────────┴─────────────────────┴─────────────────────┴──────────┐  │
│  │                    CDN / Load Balancer                         │  │
│  │                         (CloudFront / Nginx)                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                        API GATEWAY LAYER                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      Nginx Reverse Proxy                       │   │
│  │  • SSL Termination    • Rate Limiting    • Request Routing    │   │
│  │  • Load Balancing     • Caching          • WebSocket Proxy    │   │
│  └───────────────────────────┬──────────────────────────────────┘   │
├───────────────────────────────┼─────────────────────────────────────┤
│                        APPLICATION LAYER                            │
│  ┌───────────────────────────┴──────────────────────────────────┐   │
│  │                    NestJS Backend (REST API)                    │   │
│  │                                                                │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │                    CORE MODULES                            │  │   │
│  │  │  Auth  │ Users │ Students │ Faculty │ Courses │ Exams   │  │   │
│  │  │  Attendance │ Fees │ Hostel │ Transport │ Library      │  │   │
│  │  │  HR │ Payroll │ Research │ Events │ Clubs │ Sports    │  │   │
│  │  │  Complaints │ Notifications │ Chat │ Messages          │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │                     AI MODULES                             │  │   │
│  │  │  OpenAI │ LangChain │ RAG │ Embeddings │ Vector DB      │  │   │
│  │  │  Smart Search │ Chatbot │ Document Generator            │  │   │
│  │  │  Recommendations │ Predictions │ Analytics              │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │                  INFRASTRUCTURE MODULES                    │  │   │
│  │  │  Cache Manager │ Queue Manager │ File Upload            │  │   │
│  │  │  Email Service │ SMS Service │ Payment Gateway          │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  └───────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                        DATA LAYER                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │ PostgreSQL  │  │   Redis    │  │Elasticsearch│  │   Pinecone   │  │
│  │  (Primary)  │  │  (Cache)   │  │  (Search)   │  │  (Vector DB) │  │
│  │  + Prisma   │  │  + Queue   │  │  + Analytics│  │ + Embeddings │  │
│  └────────────┘  └────────────┘  └────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Architecture (Next.js 14)

```
pages/                     # App Router pages
├── auth/                  # Authentication pages
├── dashboard/             # Dashboard pages
│   ├── admin/            # Admin portal (17 pages)
│   ├── student/          # Student portal (14 pages)
│   └── faculty/          # Faculty portal (11 pages)
components/
├── ui/                   # 25 shadcn UI components
├── layout/               # Sidebar, Header, PageContainer
├── forms/                # Form components
├── tables/               # Data table components
├── charts/               # Chart components
└── ai/                   # AI-specific components
hooks/
├── useAuth.ts            # Authentication hooks
└── useApi.ts             # API query/mutation hooks
store/
├── slices/
│   ├── authSlice.ts      # Auth state
│   ├── uiSlice.ts        # UI state
│   ├── studentSlice.ts   # Student state
│   └── facultySlice.ts   # Faculty state
└── index.ts              # Redux store
lib/
├── api.ts                # Axios client + interceptors
└── utils.ts              # Utility functions
```

### Backend Architecture (NestJS)

```
src/
├── main.ts               # Entry point
├── app.module.ts         # Root module (30+ modules)
├── config/               # Configuration
├── common/               # Shared utilities
│   ├── constants/        # Role matrices, constants
│   ├── decorators/       # @Roles, @Public, @CurrentUser
│   ├── filters/          # Exception filters
│   ├── guards/           # JWT + RBAC guards
│   ├── interceptors/     # Transform, Logging, Timeout
│   ├── middleware/        # Logger middleware
│   ├── pipes/            # Validation pipes
│   └── utils/            # Helpers (Pagination, Date, File, etc.)
├── database/
│   ├── prisma/           # Prisma service
│   └── redis/            # Redis service
└── modules/              # 34 feature modules
    ├── auth/             # JWT, OAuth, 2FA, Sessions
    ├── users/            # User CRUD, Role management
    ├── students/         # Student lifecycle
    ├── faculty/          # Faculty management
    ├── departments/      # Department structure
    ├── courses/          # Curriculum management
    ├── attendance/       # Real-time attendance
    ├── exams/            # Exam scheduling, results
    ├── fees/             # Fee structure, payments
    ├── hostel/           # Room allocation
    ├── transport/        # Route & vehicle management
    ├── library/          # Book management
    ├── research/         # Projects, publications
    ├── hr/               # Employee management
    ├── payroll/          # Salary processing
    ├── leave/            # Leave management
    ├── placements/       # Campus placement
    ├── training/         # Training programs
    ├── complaints/       # Grievance system
    ├── notifications/    # Real-time notifications
    ├── chat/             # Real-time messaging
    ├── ai/               # AI & LLM integration
    └── chatbot/          # AI chatbot
```

## Database Schema

### Entity Relationships

```
User (1) ── (N) UserRoleMapping
User (1) ── (1) Student
User (1) ── (1) Faculty
User (1) ── (1) Employee
User (1) ── (1) Guardian
User (1) ── (1) Alumni
User (1) ── (N) Notification
User (1) ── (N) Application
User (1) ── (N) Document

Student (N) ── (1) Department
Student (N) ── (1) Course
Student (N) ── (1) Batch
Student (N) ── (1) Section
Student (1) ── (N) Guardian
Student (1) ── (N) Attendance
Student (1) ── (N) ExamResult
Student (1) ── (N) FeeAccount
Student (1) ── (N) HostelAllocation
Student (1) ── (N) TransportPass
Student (1) ── (N) LibraryIssue

Faculty (N) ── (1) Department
Faculty (N) ── (N) Subject (via CourseFaculty)
Faculty (1) ── (N) ResearchProject
Faculty (1) ── (N) Publication

Department (1) ── (N) Course
Department (1) ── (N) Faculty
Department (1) ── (N) Student
Course (1) ── (N) Batch
Course (1) ── (N) Subject
Batch (1) ── (N) Section
Subject (1) ── (N) Exam
Subject (1) ── (N) Attendance

Hostel (1) ── (N) HostelFloor (1) ── (N) HostelRoom
TransportRoute (1) ── (N) TransportVehicle
TransportRoute (1) ── (N) TransportPass

LibraryItem (1) ── (N) LibraryIssue
LibraryItem (1) ── (N) LibraryReservation

Recruiter (1) ── (N) JobPosting (1) ── (N) JobApplication
Event (1) ── (N) EventRegistration
Club (1) ── (N) ClubMembership
Training (1) ── (N) TrainingParticipant
ResearchProject (1) ── (N) ResearchStudent
ResearchProject (1) ── (N) Publication
Complaint (1) ── (N) ComplaintUpdate
AIConversation (1) ── (N) AIMessage
```

## Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client   │     │  Backend  │     │    DB    │     │   Redis   │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                 │                 │                 │
     │  POST /login    │                 │                 │
     │────────────────>│                 │                 │
     │                 │  Check Lockout  │                 │
     │                 │────────────────>│                 │
     │                 │                 │     Get/Set     │
     │                 │──────────────────────────────────>│
     │                 │                 │                 │
     │                 │  Find User      │                 │
     │                 │────────────────>│                 │
     │                 │                 │                 │
     │                 │  Verify Password│                 │
     │                 │  (bcrypt)       │                 │
     │                 │                 │                 │
     │                 │  Check 2FA      │                 │
     │                 │  (speakeasy)    │                 │
     │                 │                 │                 │
     │                 │  Generate JWT   │                 │
     │                 │                 │                 │
     │                 │  Create Audit   │                 │
     │                 │  Log            │                 │
     │                 │────────────────>│                 │
     │                 │                 │                 │
     │  { token,       │                 │                 │
     │    user }       │                 │                 │
     │<────────────────│                 │                 │
```

## AI Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        AI MODULE                              │
│                                                               │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │   OpenAI     │    │   LangChain  │    │   Pinecone   │    │
│  │   GPT-4      │───>│  - Chains    │───>│  - Vector DB │    │
│  │   Embeddings │    │  - Agents    │    │  - Semantic  │    │
│  │              │    │  - RAG       │    │    Search    │    │
│  └─────────────┘    └──────┬───────┘    └──────────────┘    │
│                            │                                  │
│  ┌─────────────────────────┴──────────────────────────────┐  │
│  │                   RETRIEVAL PIPELINE                    │  │
│  │                                                         │  │
│  │  User Query → Embedding → Vector Search → Context      │  │
│  │  → LLM Prompt → Response → Format → Send to User       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  DOCUMENT GENERATOR                      │  │
│  │                                                         │  │
│  │  Template + Variables → LLM → Generate → PDF/Print      │  │
│  │  • Bonafide Certificate                                 │  │
│  │  • Character Certificate                                 │  │
│  │  • Migration Certificate                                 │  │
│  │  • Transcript                                            │  │
│  │  • Recommendation Letter                                  │  │
│  │  • Leave Application                                     │  │
│  │  • Scholarship Application                                │  │
│  └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                            │
│                                                               │
│  Layer 1: Network Security                                    │
│  ├── Firewall (iptables / Security Groups)                    │
│  ├── DDoS Protection (CloudFlare / AWS Shield)               │
│  └── VPN for Admin Access                                     │
│                                                               │
│  Layer 2: Application Security                                │
│  ├── HTTPS / TLS 1.3                                          │
│  ├── Helmet.js Security Headers                               │
│  ├── Rate Limiting (ThrottlerModule)                          │
│  ├── CORS Configuration                                       │
│  └── CSRF Protection                                          │
│                                                               │
│  Layer 3: Authentication & Authorization                      │
│  ├── JWT with Refresh Tokens                                  │
│  ├── OAuth 2.0 (Google, Microsoft)                            │
│  ├── Two-Factor Authentication (TOTP)                         │
│  ├── RBAC with 23 Roles                                       │
│  └── Permission Matrix                                        │
│                                                               │
│  Layer 4: Data Security                                       │
│  ├── Input Validation & Sanitization                          │
│  ├── SQL Injection Protection (Prisma)                        │
│  ├── XSS Protection                                           │
│  ├── Password Hashing (bcrypt, 12 rounds)                    │
│  ├── Data Encryption at Rest (PostgreSQL)                     │
│  └── Audit Logging                                            │
│                                                               │
│  Layer 5: API Security                                        │
│  ├── API Key Authentication                                   │
│  ├── Request Validation (class-validator)                     │
│  ├── Pagination Limits                                        │
│  ├── File Upload Restrictions                                 │
│  └── API Versioning                                           │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client   │     │  Nginx   │     │  Backend  │     │ Database │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                 │                 │                 │
     │  HTTPS Request  │                 │                 │
     │────────────────>│                 │                 │
     │                 │  SSL Terminate  │                 │
     │                 │  Rate Limit     │                 │
     │                 │  Route /api/*   │                 │
     │                 │────────────────>│                 │
     │                 │                 │  Auth Check    │
     │                 │                 │  RBAC Check    │
     │                 │                 │  Validate      │
     │                 │                 │────────────────>│
     │                 │                 │                 │
     │                 │                 │  Cache Check   │
     │                 │                 │──── Redis ────>│
     │                 │                 │                 │
     │                 │                 │  Process       │
     │                 │                 │  Response      │
     │                 │<────────────────│                 │
     │                 │                 │                 │
     │  JSON Response  │                 │                 │
     │<────────────────│                 │                 │
```

## Deployment Topology

### Development
```
Local Machine
├── PostgreSQL (localhost:5432)
├── Redis (localhost:6379)
├── Backend (localhost:4000)
└── Frontend (localhost:3000)
```

### Staging
```
Single Server / VPS
├── Docker Host
│   ├── PostgreSQL (container)
│   ├── Redis (container)
│   ├── Backend (container) x1
│   ├── Frontend (container) x1
│   └── Nginx (container)
└── Monitoring (Grafana + Loki)
```

### Production
```
Cloud Infrastructure (AWS / Azure / DO)
├── Load Balancer (ALB / Nginx)
├── Application Servers (x3+)
│   ├── Backend Containers
│   └── Frontend Containers
├── Managed PostgreSQL (RDS)
├── Managed Redis (ElastiCache)
├── Object Storage (S3 / Cloudinary)
├── CDN (CloudFront)
└── Monitoring + Alerting
```

## Performance Metrics

| Metric | Target | Tool |
|--------|--------|------|
| API Response Time | <200ms | New Relic / Sentry |
| Database Queries | <100ms | Prisma Logging |
| Page Load Time | <2s | Lighthouse |
| Time to Interactive | <3s | Web Vitals |
| Uptime | 99.9% | Uptime Robot |
| Error Rate | <0.1% | Sentry |
| Cache Hit Ratio | >80% | Redis Stats |

## Technologies & Versions

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime |
| NestJS | 10.x | Backend framework |
| Next.js | 14.x | Frontend framework |
| React | 18.x | UI library |
| TypeScript | 5.x | Language |
| PostgreSQL | 16.x | Database |
| Redis | 7.x | Cache & Queue |
| Elasticsearch | 8.x | Search engine |
| Prisma | 5.x | ORM |
| Docker | 24+ | Containerization |
| Nginx | Latest | Reverse proxy |
| OpenAI | Latest | AI/LLM |
| LangChain | Latest | AI framework |
