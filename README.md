# Smart AI Campus Management System 2026

## AI Powered University ERP & Automation Platform

**Developed by Mohammad Wasiq**

[![CI/CD](https://github.com/yourusername/smart-campus-erp/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/yourusername/smart-campus-erp/actions/workflows/ci-cd.yml)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen)](https://docker.com)
[![Node](https://img.shields.io/badge/node-20.x-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)](https://typescriptlang.org)
[![NestJS](https://img.shields.io/badge/nestjs-10.x-red)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/nextjs-14.x-black)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/postgresql-16-blue)](https://postgresql.org)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Overview

Smart AI Campus Management System is a comprehensive, enterprise-grade University ERP platform that leverages artificial intelligence to manage every academic, administrative, financial, communication, and campus service operation from a single intelligent platform. Comparable to Microsoft Dynamics, SAP Education ERP, Oracle Campus Solutions, and Salesforce Education Cloud.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Next.js)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Student  │ │ Faculty  │ │  Admin   │ │  AI Chatbot  │   │
│  │  Portal  │ │  Portal  │ │  Panels  │ │  Interface   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────────┤
│              API Gateway (Nginx / Load Balancer)              │
├─────────────────────────────────────────────────────────────┤
│                    Backend (NestJS)                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Authentication  │  RBAC  │  JWT  │  OAuth  │  2FA    │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  Core Modules: Students, Faculty, Courses, Exams,      │  │
│  │  Attendance, Fees, Hostel, Transport, Library, HR,     │  │
│  │  Payroll, Research, Events, Clubs, Sports, Medical     │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  AI Module: OpenAI, LangChain, RAG, Embeddings,        │  │
│  │  Vector DB, Knowledge Base, Document Generator,        │  │
│  │  Smart Search, Recommendations, Predictions            │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  Realtime: WebSocket, Redis Pub/Sub, Notifications     │  │
│  └────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                                 │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌─────────────┐  │
│  │PostgreSQL│ │  Redis   │ │Elasticsearch│ │  Vector DB  │  │
│  │ (Primary)│ │ (Cache)  │ │  (Search)  │ │  (Pinecone) │  │
│  └──────────┘ └──────────┘ └────────────┘ └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** TailwindCSS, Shadcn UI
- **State:** Redux Toolkit, React Query
- **Forms:** React Hook Form, Zod
- **Animation:** Framer Motion
- **Charts:** Recharts, Chart.js
- **PWA:** next-pwa
- **Themes:** next-themes (Dark/Light)

### Backend
- **Framework:** NestJS 10
- **Language:** TypeScript
- **API:** REST (versioned), WebSocket
- **ORM:** Prisma (PostgreSQL)
- **Cache:** Redis (ioredis)
- **Queue:** BullMQ
- **Auth:** JWT, OAuth (Google/Microsoft), 2FA (TOTP)
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger/OpenAPI
- **File Upload:** Multer, Cloudinary, AWS S3

### Database
- **Primary:** PostgreSQL 16
- **Cache:** Redis 7
- **Search:** Elasticsearch 8
- **Vector DB:** Pinecone

### AI & Machine Learning
- **LLM:** OpenAI GPT-4
- **Framework:** LangChain
- **Embeddings:** text-embedding-3-small
- **RAG:** Retrieval Augmented Generation
- **Vector Store:** Pinecone
- **Agents:** LangChain Agents

### DevOps
- **Container:** Docker & Docker Compose
- **Proxy:** Nginx
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry, Winston
- **Backup:** Automated PostgreSQL backups

## Features

### Core ERP Modules
- **Student Information System** - Complete student lifecycle management
- **Faculty Management** - Faculty records, load distribution, performance
- **Course Management** - Curriculum, subjects, batches, sections
- **Attendance System** - Real-time marking, reports, notifications
- **Examination Management** - Scheduling, grading, transcripts, certificates
- **Fee Management** - Fee structure, payments, receipts, scholarships
- **Hostel Management** - Rooms, allocations, fees, transfers
- **Transport Management** - Routes, vehicles, passes, tracking
- **Library Management** - Books, issue/return, fines, reservations
- **HR & Payroll** - Employees, attendance, payroll, leaves
- **Research Management** - Projects, publications, grants
- **Event Management** - Academic, cultural, sports events
- **Inventory & Assets** - Equipment tracking, maintenance
- **Placement & Training** - Company relations, job postings, training programs

### AI-Powered Features
- **AI Student Assistant** - 24/7 intelligent chat support
- **AI Teacher Assistant** - Lesson planning, grading assistance
- **AI Administrative Assistant** - Process automation, routing
- **Smart Document Generator** - Auto-generate certificates, letters
- **AI Smart Routing** - Automatic department routing
- **AI Scheduling** - Timetable optimization, conflict detection
- **AI Recommendations** - Course, career, placement suggestions
- **AI Analytics** - Risk prediction, dropout prediction, insights
- **RAG Knowledge Base** - Semantic search across campus knowledge
- **Multi-language Support** - Regional language support

### Security
- JWT with refresh tokens
- Role-Based Access Control (23 roles)
- Two-Factor Authentication (TOTP)
- OAuth 2.0 (Google, Microsoft)
- Rate limiting & brute force protection
- Audit logging & trail
- Data encryption at rest and in transit
- XSS, CSRF, SQL injection protection
- Input validation & sanitization

## User Roles

| Role | Description |
|------|-------------|
| SUPER_ADMIN | Full system access |
| CHANCELLOR | University head - reports & analytics |
| VICE_CHANCELLOR | Academic leadership |
| REGISTRAR | Student records & administration |
| FINANCE | Financial operations |
| ACADEMIC_OFFICE | Academic administration |
| ADMISSION_OFFICE | Admission processing |
| EXAMINATION_DEPT | Exam management |
| LIBRARY_STAFF | Library operations |
| HOSTEL_OFFICE | Hostel management |
| TRANSPORT_OFFICE | Transport management |
| TNP_CELL | Training & placement |
| DEPARTMENT_HEAD | Department leadership |
| FACULTY | Teaching staff |
| ASSISTANT_PROFESSOR | Assistant professor |
| LECTURER | Lecturer |
| STUDENT | Student portal |
| GUARDIAN | Parent/guardian portal |
| ALUMNI | Alumni network |
| SECURITY_STAFF | Security management |
| MAINTENANCE_STAFF | Maintenance operations |
| RECEPTION | Front desk |
| SUPPORT_AGENT | Help desk support |
| GUEST | Limited public access |

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 16
- Redis 7
- Docker & Docker Compose (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/smart-campus-erp.git
cd smart-campus-erp

# Install dependencies
npm run setup

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:push
npm run db:seed

# Start development
npm run dev
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# Run database migrations
docker exec campus-backend npx prisma migrate deploy

# Seed database
docker exec campus-backend npx prisma db seed

# Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:4000/api/v1
API Docs: http://localhost:4000/api/docs
```

## Project Structure

```
smart-campus-erp/
├── backend/                    # NestJS Backend
│   ├── prisma/                 # Database Schema & Migrations
│   │   └── schema.prisma       # Complete database schema
│   ├── src/
│   │   ├── main.ts             # Application entry point
│   │   ├── app.module.ts       # Root module
│   │   ├── config/             # Configuration
│   │   ├── common/             # Shared utilities
│   │   │   ├── constants/      # Constants & enums
│   │   │   ├── decorators/     # Custom decorators
│   │   │   ├── filters/        # Exception filters
│   │   │   ├── guards/         # Auth & role guards
│   │   │   ├── interceptors/   # Request interceptors
│   │   │   ├── middleware/     # Middleware
│   │   │   ├── pipes/          # Validation pipes
│   │   │   └── utils/          # Helper utilities
│   │   ├── database/           # Database modules
│   │   │   ├── prisma/         # Prisma service
│   │   │   └── redis/          # Redis service
│   │   └── modules/            # Feature modules
│   │       ├── auth/           # Authentication
│   │       ├── users/          # User management
│   │       ├── students/       # Student management
│   │       ├── faculty/        # Faculty management
│   │       ├── departments/    # Department management
│   │       ├── courses/        # Course management
│   │       ├── attendance/     # Attendance system
│   │       ├── exams/          # Examination
│   │       ├── grades/         # Grading system
│   │       ├── fees/           # Fee management
│   │       ├── hostel/         # Hostel management
│   │       ├── transport/      # Transport management
│   │       ├── library/        # Library management
│   │       ├── inventory/      # Inventory & assets
│   │       ├── research/       # Research management
│   │       ├── hr/             # HR management
│   │       ├── payroll/        # Payroll processing
│   │       ├── leave/          # Leave management
│   │       ├── recruitment/    # Recruitment
│   │       ├── documents/      # Document management
│   │       ├── notices/        # Notice board
│   │       ├── events/         # Event management
│   │       ├── clubs/          # Club management
│   │       ├── sports/         # Sports management
│   │       ├── medical/        # Medical center
│   │       ├── complaints/     # Complaint system
│   │       ├── helpdesk/       # Help desk
│   │       ├── visitors/       # Visitor management
│   │       ├── guardians/      # Guardian portal
│   │       ├── alumni/         # Alumni network
│   │       ├── career/         # Career development
│   │       ├── placements/     # Placement cell
│   │       ├── training/       # Training programs
│   │       ├── payments/       # Payment gateway
│   │       ├── reports/        # Reporting
│   │       ├── settings/       # System settings
│   │       ├── audit/          # Audit logging
│   │       ├── notifications/  # Notifications
│   │       ├── chat/           # Real-time chat
│   │       ├── messaging/      # Internal messaging
│   │       ├── ai/             # AI module
│   │       └── chatbot/        # AI Chatbot
│   └── test/                   # E2E tests
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/                # App router pages
│   │   │   ├── auth/           # Authentication pages
│   │   │   ├── dashboard/      # Dashboard pages
│   │   │   │   ├── admin/      # Admin portal
│   │   │   │   ├── student/    # Student portal
│   │   │   │   └── faculty/    # Faculty portal
│   │   ├── components/         # React components
│   │   │   ├── ui/             # UI component library
│   │   │   └── layout/         # Layout components
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilities & API
│   │   ├── store/              # Redux store
│   │   └── types/              # TypeScript types
│   ├── public/                 # Static assets
│   └── ...
├── deployment/                 # Deployment configuration
│   ├── docker/                 # Dockerfiles
│   ├── nginx/                  # Nginx configuration
│   ├── monitoring/             # Monitoring setup
│   └── scripts/                # Deployment scripts
├── database/                   # Database scripts
│   └── scripts/                # SQL scripts
├── docs/                       # Documentation
│   ├── api/                    # API documentation
│   ├── architecture/           # Architecture docs
│   ├── deployment/             # Deployment guide
│   └── user-guides/            # User manuals
├── .github/workflows/          # GitHub Actions CI/CD
├── docker-compose.yml          # Docker Compose
└── README.md                   # This file
```

## API Documentation

Interactive API documentation is available via Swagger UI when the backend is running:

- **Development:** http://localhost:4000/api/docs
- **Production:** https://your-domain.com/api/docs

### API Versioning
All endpoints are versioned under `/api/v1/` prefix.

### Authentication
- Bearer JWT token required for protected endpoints
- Public endpoints marked with `@Public()` decorator
- Token refresh via `/api/v1/auth/refresh`

## Database Schema

The system uses a normalized PostgreSQL database with 60+ tables covering:
- Users & Authentication (5 tables)
- Student Information (15 tables)
- Academic Structure (8 tables)
- Attendance & Timetable (3 tables)
- Examinations & Grades (6 tables)
- Fees & Finance (4 tables)
- Hostel Management (4 tables)
- Transport Management (3 tables)
- Library Management (3 tables)
- Research & Publications (4 tables)
- HR & Payroll (3 tables)
- Complaints & Service (3 tables)
- Events & Clubs (4 tables)
- AI & Knowledge Base (4 tables)
- System & Audit (3 tables)

## License

MIT License

## Contact

**Developer:** Mohammad Wasiq

---

*Smart AI Campus Management System 2026 - Enterprise Edition*
