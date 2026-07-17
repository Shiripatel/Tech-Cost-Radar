# AGENTS.md

# TechSpend AI
### Enterprise Technology Spend Intelligence Platform

Version: 1.0
Status: Greenfield
Owner: Shirish Patel

---

# Mission

Build an enterprise SaaS platform that enables CFOs, CIOs, Procurement, Finance, Internal Audit, and IT leaders to understand, optimize, and govern all technology spending.

The platform should provide visibility into:

- AI Spend
- SaaS Spend
- Cloud Spend
- ERP Cost
- Technology Portfolio
- Software License Utilization
- Vendor Contracts
- Procurement
- Budget vs Actual
- Technology ROI
- Forecasting
- Audit & Compliance
- Executive Decision Support

The platform is NOT a reporting tool.

It is a decision intelligence platform.

Every feature should answer one or more of these questions:

- Where are we overspending?
- What should we optimize?
- Which vendors should we eliminate?
- What is our AI ROI?
- Which licenses are unused?
- Which contracts are expiring?
- What are the biggest risks?
- How much money can we save?

---

# Product Vision

Our goal is to become the Bloomberg Terminal for Technology Spend.

The system should combine:

IT Asset Management
+
SaaS Management
+
FinOps
+
AI Cost Intelligence
+
Procurement
+
Internal Audit
+
Executive AI Assistant

into one unified platform.

---

# Primary Users

## CFO
Needs:
- Technology cost
- Budget variance
- ROI
- Forecast
- Savings
- Executive reports

## CIO
Needs:
- Technology portfolio
- Cloud
- Applications
- Infrastructure
- License utilization

## Procurement
Needs:
- Contracts
- Renewals
- Vendor comparison
- Negotiation opportunities

## Internal Audit
Needs:
- Technology risks
- Unused assets
- Duplicate software
- Shadow IT
- AI Governance
- SOX, ISO, SOC2
- Evidence collection

## IT Asset Manager
Needs:
- Hardware
- Software
- Ownership
- Lifecycle
- Inventory

## Department Managers
Needs:
- Department spend
- Usage
- Chargeback
- Forecast

---

# Core Modules

1. Executive Dashboard
2. AI Spend
3. SaaS Portfolio
4. Cloud Cost
5. ERP Cost
6. Hardware Assets
7. Software Licenses
8. Vendor Management
9. Contracts
10. Procurement
11. Budget
12. Forecast
13. Recommendations
14. Audit
15. AI Assistant
16. Reports
17. Administration

---

# Design Principles

- Enterprise first
- Simple
- Fast
- Data driven
- Minimal clicks
- Modern
- Dark mode
- Accessible
- Responsive

*Every screen must have a clear business purpose. Avoid unnecessary visual clutter.*

---

# UI Style

Inspired by:
- Ramp
- Flexera
- Linear
- Stripe Dashboard
- Vercel
- Notion
- Power BI
- Snowflake

*Do NOT copy any existing product. Use inspiration only. Create an original design.*

---

# Color Palette

- **Primary:** Blue, Slate, White, Dark Gray
- **Success:** Green
- **Warning:** Amber
- **Error:** Red

*Charts should be color-blind friendly.*

---

# Typography

- Inter
- Clean spacing
- Large KPI cards
- Minimal borders
- Rounded corners
- Consistent spacing

---

# Dashboard Philosophy

Every dashboard must answer:
- What happened?
- Why?
- What should I do?

*Avoid dashboards that only display charts. Every page should contain recommendations.*

---

# Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui, TanStack Query, React Hook Form, Zod, ECharts
- **Backend:** Python, FastAPI, SQLAlchemy 2, Alembic, Pydantic, Redis, Celery, PostgreSQL
- **Storage:** PostgreSQL, Redis, S3 Compatible Storage
- **Infrastructure:** Docker, Docker Compose, GitHub Actions, Cloudflare, Vercel, Railway or Azure

---

# Database Rules

- Always normalize data.
- Use UUID primary keys.
- Use `created_at`, `updated_at`, `deleted_at`
- Audit every important change.
- Soft delete where appropriate.
- Never duplicate data unnecessarily.

---

# API Design

- REST first.
- Version every endpoint (e.g. `/api/v1/organizations`, `/api/v1/licenses`, `/api/v1/vendors`, `/api/v1/ai-spend`)
- Follow OpenAPI standards.
- Generate Swagger documentation automatically.

---

# Authentication

- Support Email, Google, Microsoft, Azure AD, Okta, Magic Links
- MFA
- RBAC
- Session management
- Audit logs
- JWT + Refresh Tokens
- Enterprise SSO ready

---

# Security

- OWASP Top 10 compliant.
- Encrypt secrets. Never expose API keys.
- Support rate limiting.
- Input validation everywhere.
- Parameterized SQL only.
- CSRF & XSS protection.
- Secure cookies.
- Role-based authorization.
- Audit logging.

---

# Logging

- Structured logs.
- Never print secrets.
- Every API request should have: Request ID, User ID, Organization ID, Latency, Status code

---

# Coding Standards

- Readable code over clever code.
- Functions should do one thing.
- Prefer composition.
- Avoid duplicate logic.
- Strong typing everywhere.
- No hardcoded values.
- Centralize configuration.
- Write production-grade code only.

---

# Testing

Every module should include: Unit, Integration, API, Error handling, and Validation tests.
Target: >90% coverage.

---

# Documentation

Every module requires: README, Architecture notes, API documentation, Database changes, Migration notes, Deployment instructions.

---

# AI Guidelines

- Use AI to explain findings.
- Never fabricate financial metrics.
- Always show calculations.
- Provide confidence where applicable.
- Every recommendation should include: Estimated savings, Business impact, Reason, Supporting evidence.

---

# Integrations

Support connectors for:
- Microsoft Graph, Azure Cost Management, AWS Cost Explorer, Google Cloud Billing
- OpenAI, Anthropic
- Snowflake, Databricks
- SAP, Oracle, Salesforce, ServiceNow, Jira, Slack, Workday, Okta
- Google Workspace, Microsoft 365
- CSV/Excel Upload, API Import, Webhook Import

---

# Analytics

- Support: Daily, Weekly, Monthly, Quarterly, Yearly
- Breakdown: Department, Business Unit, Vendor, Cost Center, Region, Application, Project

---

# Reports

- PDF, Excel, CSV, PowerPoint
- Reports: Executive Summary, Board Reports, Audit Reports, Forecast Reports

---

# AI Assistant

The AI assistant should answer:
- Why did spending increase?
- How much can we save?
- Which vendors overlap?
- Which licenses are unused?
- Which contracts expire soon?
- What are my audit risks?
- Forecast next quarter. Show executive summary, anodmaly explanation, and optimization.

---

# Performance Goals

- Dashboard load < 2 seconds
- API < 300ms average
- Support 100,000+ users, Millions of records
- Horizontal scaling

---

# Accessibility

- WCAG AA
- Keyboard navigation
- Screen reader support
- High contrast mode

---

# Multi-Tenant Requirements

- Organizations are isolated. No cross-tenant access.
- Every query must filter by organization.
- Support enterprise customers.

---

# Development Workflow

- Never generate the whole application at once.
- Implement one feature at a time.
- Every feature must include: Backend, Frontend, Tests, Documentation, Migration, API, Validation, Error handling.
- Only proceed to the next feature after the current one is complete.

---

# Product Philosophy

We are not building another dashboard. We are building a Technology Decision Intelligence Platform. Every feature should help executives make better financial and operational decisions. If a feature only displays data without actionable insight, redesign it until it provides recommendations.
