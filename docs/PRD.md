# Product Requirements Document (PRD)

## API Sentinel

### API Monitoring & Incident Management Platform

**Version:** 1.0.0
**Product Type:** Full-stack API monitoring and incident management platform

---

## 1. Product Overview

**Product Name:** API Sentinel

API Sentinel is a full-stack API monitoring and incident management platform designed to allow developers and teams to continuously monitor the availability and performance of HTTP APIs.

Users can register APIs as monitors and configure monitoring parameters such as HTTP method, expected status code, check interval, timeout, and failure threshold.

The system periodically executes monitoring checks using background workers. Each check records the API's availability, HTTP status, response time, and errors.

When an API experiences repeated failures beyond the configured failure threshold, API Sentinel automatically creates an incident.

When the monitored API recovers, the system automatically detects the recovery and resolves the incident.

The frontend dashboard receives important monitor and incident changes in real time through Socket.IO.

---

# 2. Target Users

### Developers

Developers can:

* Register APIs for monitoring
* Configure monitoring settings
* View API health
* Inspect monitoring history
* Investigate failures
* View and manage incidents

### Engineering Teams

Teams can:

* Monitor multiple APIs
* Track active incidents
* Analyze uptime and response-time trends
* Investigate recurring API failures
* Track incident lifecycle

### System Administrators

Administrators can:

* Manage users
* Manage monitoring resources
* View system-level information
* Manage platform configuration where applicable

---

# 3. Core Features

## 3.1 User Authentication & Authorization

* User registration
* User login
* JWT-based authentication
* Protected API routes
* Password hashing using bcrypt
* Current-user information
* Logout/token handling
* Authentication middleware
* User ownership of monitors and incidents

### MVP Authentication

The initial authentication system will contain:

* Register
* Login
* Get current user
* Protected routes
* Password hashing
* JWT authentication

Advanced authentication features such as email verification, password reset, refresh-token rotation, OAuth, and RBAC may be added later.

---

## 3.2 Monitor Management

Users can create and manage APIs that should be monitored.

A monitor contains information such as:

* Monitor name
* Target URL
* HTTP method
* Expected HTTP status code
* Check interval
* Timeout
* Failure threshold
* Enabled/disabled status

Users can:

* Create monitors
* List monitors
* View monitor details
* Update monitors
* Delete monitors
* Enable monitors
* Disable monitors

Example monitor:

```text
Name: Payment API
URL: https://example.com/payment/health
Method: GET
Expected Status: 200
Interval: 60 seconds
Timeout: 5 seconds
Failure Threshold: 3
```

---

## 3.3 API Monitoring

The monitoring system periodically checks configured APIs.

Each monitoring check should determine:

* Whether the API is reachable
* HTTP status code
* Response time
* Timeout
* Connection errors
* Other request errors
* Success/failure status

The monitoring worker performs the actual HTTP request.

Example:

```text
BullMQ Job
    ↓
Monitoring Worker
    ↓
GET /payment/health
    ↓
Target API
    ↓
HTTP 200
    ↓
Response: 143ms
    ↓
Store Check Result
```

---

## 3.4 Monitoring History

Every monitoring execution should produce a check result.

The system should retain information such as:

* Monitor ID
* Check timestamp
* Success/failure
* HTTP status
* Response time
* Error information
* Timeout information

Users should be able to view recent monitoring history for a monitor.

---

## 3.5 Failure Detection

API Sentinel should avoid creating an incident after a single temporary failure unless the configured threshold is `1`.

The system tracks consecutive failures.

Example:

```text
Failure #1
    ↓
Failure #2
    ↓
Failure #3
    ↓
Threshold reached
    ↓
Create Incident
```

If the threshold is:

```text
3 consecutive failures
```

then an incident is created only after three consecutive failed checks.

A successful check resets the consecutive failure state.

---

## 3.6 Incident Management

The system automatically creates incidents when a monitor reaches its configured failure threshold.

Incident statuses:

```text
OPEN
  ↓
ACKNOWLEDGED
  ↓
RESOLVED
```

The system should support:

* Automatic incident creation
* Incident listing
* Incident details
* Incident acknowledgement
* Automatic resolution
* Incident timeline
* Incident status
* Failure information
* Recovery information

---

## 3.7 Automatic Recovery

When a monitor with an active incident successfully recovers, API Sentinel should automatically resolve the incident.

Example:

```text
API DOWN
   ↓
3 consecutive failures
   ↓
Incident OPEN
   ↓
API RECOVERS
   ↓
Successful check
   ↓
Incident RESOLVED
```

The resolution should record the recovery time.

---

## 3.8 Real-Time Updates

Socket.IO will provide real-time updates between the backend and React frontend.

Real-time events include:

* Monitor status changes
* Incident creation
* Incident acknowledgement
* Incident resolution

Example:

```text
Monitoring Worker
      ↓
Incident Engine
      ↓
Socket.IO
      ↓
React Dashboard
```

The frontend should update relevant UI elements without requiring a manual page refresh.

---

## 3.9 Dashboard

The dashboard should provide an overview of the monitoring system.

The MVP dashboard should display:

* Total monitors
* Healthy monitors
* Failing monitors
* Active incidents
* Recent checks
* Monitor status
* Uptime information
* Response-time information
* Basic monitoring analytics

Charts may be implemented using Recharts or another suitable React charting library.

---

## 3.10 System Health

The backend should expose a health endpoint that can be used to determine whether the API server is running.

Example:

```text
GET /api/v1/health
```

Expected response:

```json
{
  "status": "OK"
}
```

---

# 4. Technical Specifications

## 4.1 Technology Stack

### Frontend

* React

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Background Processing

* Redis
* BullMQ

### Real-Time Communication

* Socket.IO

### Authentication

* JWT
* bcrypt

### API Testing

* Postman

### Charts

* Recharts or another appropriate React charting library

### Containerization

* Docker
* Docker Compose

### Version Control

* Git
* GitHub

---

# 5. Node.js Module System

API Sentinel will use **ECMAScript Modules (ESM)**.

The project will use:

```javascript
import express from "express";
```

instead of CommonJS:

```javascript
const express = require("express");
```

The Node.js project will therefore be configured with:

```json
{
  "type": "module"
}
```

All backend code should consistently follow the ESM approach.

Example:

```javascript
import express from "express";
```

```javascript
import mongoose from "mongoose";
```

This decision applies throughout the Node.js backend.

---

# 6. API Endpoint Structure

The REST API will use versioned routes:

```text
/api/v1/
```

---

## 6.1 Authentication Routes

**Authentication Routes**

```text
/api/v1/auth/
```

### Register

```text
POST /api/v1/auth/register
```

Creates a new user account.

### Login

```text
POST /api/v1/auth/login
```

Authenticates a user and returns authentication information.

### Logout

```text
POST /api/v1/auth/logout
```

Logs out the authenticated user.

### Current User

```text
GET /api/v1/auth/me
```

Returns the currently authenticated user's information.

### Change Password

```text
POST /api/v1/auth/change-password
```

Changes the authenticated user's password.

---

# 6.2 Monitor Routes

**Monitor Routes**

```text
/api/v1/monitors/
```

### List Monitors

```text
GET /api/v1/monitors
```

Returns monitors belonging to the authenticated user.

### Create Monitor

```text
POST /api/v1/monitors
```

Creates a new API monitor.

### Get Monitor

```text
GET /api/v1/monitors/:monitorId
```

Returns information about a specific monitor.

### Update Monitor

```text
PUT /api/v1/monitors/:monitorId
```

Updates monitor configuration.

### Delete Monitor

```text
DELETE /api/v1/monitors/:monitorId
```

Deletes a monitor.

### Enable Monitor

```text
PATCH /api/v1/monitors/:monitorId/enable
```

Enables monitoring.

### Disable Monitor

```text
PATCH /api/v1/monitors/:monitorId/disable
```

Disables monitoring.

### Monitor Status

```text
GET /api/v1/monitors/:monitorId/status
```

Returns the current monitoring status.

---

# 6.3 Monitoring Check Routes

**Check Routes**

```text
/api/v1/monitors/:monitorId/checks
```

### Check History

```text
GET /api/v1/monitors/:monitorId/checks
```

Returns monitoring history for a monitor.

### Specific Check

```text
GET /api/v1/monitors/:monitorId/checks/:checkId
```

Returns details about a specific monitoring check.

---

# 6.4 Incident Routes

**Incident Routes**

```text
/api/v1/incidents/
```

### List Incidents

```text
GET /api/v1/incidents
```

Returns incidents belonging to the authenticated user.

Optional filtering may include:

```text
status
monitorId
date range
```

### Get Incident

```text
GET /api/v1/incidents/:incidentId
```

Returns incident details.

### Acknowledge Incident

```text
PATCH /api/v1/incidents/:incidentId/acknowledge
```

Changes an incident from:

```text
OPEN
```

to:

```text
ACKNOWLEDGED
```

### Resolve Incident

```text
PATCH /api/v1/incidents/:incidentId/resolve
```

Allows an authorized user to resolve an incident manually where appropriate.

Automatic resolution remains the normal recovery mechanism for monitoring incidents.

---

# 6.5 Dashboard Routes

**Dashboard Routes**

```text
/api/v1/dashboard/
```

### Dashboard Summary

```text
GET /api/v1/dashboard/summary
```

Returns high-level monitoring information.

Example information:

```text
Total monitors
Healthy monitors
Failing monitors
Active incidents
```

### Dashboard Analytics

```text
GET /api/v1/dashboard/analytics
```

Returns basic monitoring analytics for the dashboard.

---

# 6.6 Health Route

**Health Check**

```text
GET /api/v1/health
```

Returns API server health information.

---

# 7. Socket.IO Events

Socket.IO events are separate from REST API routes.

The primary real-time events are:

### Monitor Status Changed

```text
monitor:status_changed
```

Triggered when a monitor changes state.

Example:

```text
UP → DOWN
DOWN → UP
```

### Incident Created

```text
incident:created
```

Triggered when the failure threshold is reached and an incident is created.

### Incident Acknowledged

```text
incident:acknowledged
```

Triggered when an incident is acknowledged.

### Incident Resolved

```text
incident:resolved
```

Triggered when an incident is resolved.

---

# 8. Permission Model

The initial MVP will use a simple ownership model.

| Feature                  | Authenticated User | Unauthenticated User |
| ------------------------ | ------------------ | -------------------- |
| Register                 | ✓                  | ✓                    |
| Login                    | ✓                  | ✓                    |
| View Own Monitors        | ✓                  | ✗                    |
| Create Monitor           | ✓                  | ✗                    |
| Update Own Monitor       | ✓                  | ✗                    |
| Delete Own Monitor       | ✓                  | ✗                    |
| View Own Checks          | ✓                  | ✗                    |
| View Own Incidents       | ✓                  | ✗                    |
| Acknowledge Own Incident | ✓                  | ✗                    |
| View Dashboard           | ✓                  | ✗                    |

A more advanced team/RBAC system may be introduced later.

---

# 9. Data Models

The core MongoDB models are expected to include:

## 9.1 User

Important fields:

```text
_id
name
email
password
createdAt
updatedAt
```

Password values must never be stored in plaintext.

---

## 9.2 Monitor

Important fields:

```text
_id
userId
name
url
method
expectedStatus
interval
timeout
failureThreshold
enabled
status
consecutiveFailures
lastCheckedAt
lastSuccessfulAt
createdAt
updatedAt
```

Possible monitor statuses:

```text
UP
DOWN
PAUSED
```

---

## 9.3 Check Result

Important fields:

```text
_id
monitorId
status
httpStatus
responseTime
error
timedOut
checkedAt
```

A check result represents one execution of a monitoring job.

---

## 9.4 Incident

Important fields:

```text
_id
monitorId
userId
status
startedAt
acknowledgedAt
resolvedAt
failureCount
lastError
createdAt
updatedAt
```

Incident statuses:

```text
OPEN
ACKNOWLEDGED
RESOLVED
```

---

# 10. Monitoring Architecture

Monitoring will not be performed directly inside normal Express request handlers.

The monitoring architecture will use:

```text
Express
   ↓
Redis
   ↓
BullMQ
   ↓
Monitoring Worker
   ↓
Target API
   ↓
Monitoring Worker
   ↓
MongoDB
```

The worker is responsible for performing actual monitoring checks.

---

# 11. Redis Requirements

Redis will be used as infrastructure for background job processing.

Redis will support BullMQ by providing:

* Job state
* Queue information
* Scheduling information
* Worker coordination
* Retry-related state

Redis is **not** the primary persistent database for API Sentinel.

MongoDB remains the application's persistent data store.

---

# 12. BullMQ Requirements

BullMQ will manage monitoring jobs.

The system should eventually support:

* Job creation
* Delayed jobs
* Recurring monitoring jobs
* Job retries
* Failed jobs
* Job completion
* Worker processing
* Job concurrency

Example:

```text
Monitor
   ↓
Create monitoring job
   ↓
BullMQ
   ↓
Monitoring Worker
```

---

# 13. Monitoring Worker

The monitoring worker performs the actual API check.

Its responsibilities include:

1. Receive monitoring job.
2. Load monitor configuration.
3. Send HTTP request.
4. Measure response time.
5. Detect HTTP errors.
6. Detect connection errors.
7. Detect timeout.
8. Validate expected HTTP status.
9. Store check result.
10. Update monitor state.
11. Apply failure-threshold logic.
12. Trigger incident processing.
13. Emit real-time events when necessary.

---

# 14. Timeout Handling

Every monitor should have a configurable timeout.

Example:

```text
Timeout = 5 seconds
```

If the target API does not respond within the configured timeout:

```text
Check = FAILED
```

The check result should record that a timeout occurred.

Timeouts must not cause the worker itself to become permanently blocked.

---

# 15. Retry Handling

Retries will be introduced after the basic monitoring system works.

The retry system should distinguish between:

```text
Temporary job failure
```

and:

```text
Actual target API failure
```

Retry behavior must be designed carefully so that retries do not incorrectly inflate the consecutive-failure count.

The final retry strategy will be implemented after the basic worker and failure-detection mechanisms are working.

---

# 16. Failure Detection

The system tracks consecutive monitoring failures.

Example:

```text
Expected threshold = 3

Check 1 → SUCCESS
Check 2 → FAILURE
Check 3 → FAILURE
Check 4 → FAILURE
                ↓
          Incident Created
```

A successful check resets the consecutive failure counter.

Example:

```text
Failure
Failure
Success
```

results in:

```text
consecutiveFailures = 0
```

This mechanism helps reduce false-positive incidents.

---

# 17. Incident Lifecycle

The incident lifecycle is:

```text
                 Failure Threshold
                       │
                       ▼
                     OPEN
                       │
                       │ User acknowledgement
                       ▼
                 ACKNOWLEDGED
                       │
                       │ API recovery
                       ▼
                   RESOLVED
```

Automatic recovery should resolve incidents associated with recovered monitors.

---

# 18. Incident Engine

The Incident Engine is responsible for translating monitoring failures into incident state changes.

Example:

```text
Monitoring Worker
       ↓
Check Result
       ↓
Failure Detection
       ↓
Threshold Reached?
       ↓
      YES
       ↓
Incident Engine
       ↓
Create Incident
       ↓
Socket.IO
       ↓
React
```

It should also handle recovery:

```text
Successful Check
       ↓
Monitor Recovery
       ↓
Incident Engine
       ↓
Resolve Incident
       ↓
Socket.IO
       ↓
React
```

---

# 19. Security Requirements

API Sentinel should implement:

* JWT authentication
* Password hashing using bcrypt
* Authentication middleware
* Authorization/ownership checks
* Input validation
* URL validation
* Request validation
* CORS configuration
* Environment variables for secrets
* Secure handling of credentials
* Protection against unauthorized monitor access

Secrets must not be committed to Git.

---

# 20. Environment Configuration

Environment-specific configuration should be stored using environment variables.

Examples:

```text
PORT
MONGODB_URI
JWT_SECRET
REDIS_URL
```

Sensitive configuration must not be hardcoded into source code.

A `.env` file may be used locally.

The repository must contain an appropriate `.gitignore` so that secrets are not committed.

---

# 21. Git & GitHub

Git will be used from the beginning of development.

Initial repository setup:

```text
git init
```

The project should contain a `.gitignore`.

At minimum, sensitive/generated files such as:

```text
node_modules/
.env
```

should not be committed.

The project should use meaningful commits.

Example:

```text
Initial server setup
Add Express health endpoint
Add MongoDB connection
Add user authentication
Add monitor CRUD
Add monitoring worker
```

The project will eventually be pushed to GitHub.

GitHub will serve as:

* Source-code repository
* Version history
* Portfolio project
* Documentation location
* Interview reference

---

# 22. Git Development Workflow

The project will be developed incrementally.

A typical workflow:

```text
Create feature
     ↓
Implement
     ↓
Test
     ↓
Git commit
     ↓
Continue
```

For larger features, feature branches may be used:

```text
main
  │
  ├── feature/authentication
  ├── feature/monitor-crud
  └── feature/monitoring-worker
```

The exact branching strategy will be introduced when it becomes useful rather than adding unnecessary Git complexity at the beginning.

---

# 23. Frontend Requirements

The React frontend should eventually provide:

### Authentication

* Registration page
* Login page
* Authentication state

### Dashboard

* Monitor overview
* Current status
* Active incidents
* Basic analytics

### Monitor Management

* Create monitor
* Edit monitor
* Delete monitor
* Enable/disable monitor
* Monitor details

### Monitoring History

* Recent checks
* Status history
* Response times
* Errors

### Incident Management

* Incident list
* Incident details
* Incident status
* Acknowledge incident
* Resolution information

### Real-Time Updates

The dashboard should receive Socket.IO events and update the UI without requiring a manual refresh.

---

# 24. Monitoring Analytics

The MVP will provide basic analytics.

Possible metrics include:

* Uptime percentage
* Average response time
* Recent response times
* Successful checks
* Failed checks
* Incident count
* Incident duration

Advanced analytics such as:

```text
P95 response time
P99 response time
```

will be implemented after the core system works.

---

# 25. Non-Functional Requirements

## Reliability

The monitoring system should continue performing scheduled checks even when normal users are not actively using the dashboard.

## Scalability

The architecture should allow multiple monitoring workers to be introduced later.

```text
BullMQ
   ├── Worker 1
   ├── Worker 2
   └── Worker 3
```

## Maintainability

Backend responsibilities should be separated into appropriate modules as the project grows.

## Observability

The application should provide sufficient logging to troubleshoot:

* API requests
* Worker failures
* Monitoring failures
* Queue failures
* Database errors
* Incident processing

## Security

Secrets and authentication information must be protected.

---

# 26. MVP Scope

The first complete version of API Sentinel will include:

### Authentication

* Registration
* Login
* JWT
* bcrypt
* Protected routes

### Monitor Management

* Create
* Read
* Update
* Delete
* Enable/disable

### Monitoring

* HTTP checks
* Expected status validation
* Response-time measurement
* Timeout detection
* Connection-error handling
* Consecutive failure detection
* Recovery detection
* Check history

### Background Processing

* Redis
* BullMQ
* Monitoring worker
* Scheduled monitoring jobs

### Incidents

* Automatic creation
* Failure threshold
* OPEN
* ACKNOWLEDGED
* RESOLVED
* Automatic recovery
* Incident timeline

### Real-Time

* Socket.IO
* Monitor status updates
* Incident creation
* Incident resolution

### Dashboard

* Current monitor status
* Uptime
* Response time
* Recent checks
* Active incidents
* Basic analytics

### Development

* Git
* GitHub
* Environment configuration
* Postman testing

---

# 27. Post-MVP Features

The following features should **not** be implemented initially.

They can be added after the MVP is stable.

### Notifications

* Email notifications
* Slack notifications
* Webhooks

### Advanced Monitoring

* Response-body assertions
* Custom headers
* Request bodies
* P95 response time
* P99 response time
* More advanced retry policies

### Incident Management

* Incident comments
* Improved incident timelines
* Maintenance windows

### Platform Features

* Public status page
* API keys
* Rate limiting
* Audit logs
* Team accounts
* RBAC

### Infrastructure

* Advanced worker scaling
* Dead-letter strategy
* Circuit-breaker mechanisms

---

# 28. Docker Requirements

Docker will be introduced after the application works locally without containers.

The project should eventually be containerized.

Potential services:

```text
React
Node/Express
MongoDB
Redis
Monitoring Worker
```

Docker Compose will eventually be used to simplify local multi-service development.

Docker is deliberately scheduled later in development so that containerization does not hide the fundamentals of the application.

---

# 29. Deployment Requirements

The completed application should eventually be deployed.

Deployment should include:

* Frontend deployment
* Backend deployment
* MongoDB
* Redis
* Monitoring worker
* Environment variables
* Production configuration
* HTTPS where appropriate

Exact cloud providers/services will be selected later based on the final architecture and available options.

---

# 30. Testing Requirements

The project should eventually include testing for:

### Authentication

* Registration
* Login
* Invalid credentials
* Protected routes

### Monitors

* Create
* Read
* Update
* Delete
* Authorization

### Monitoring

* Successful API check
* Failed API check
* Timeout
* Invalid response
* Recovery

### Incidents

* Threshold detection
* Incident creation
* Acknowledgement
* Automatic resolution

### Worker

* Job processing
* Failed jobs
* Retry behavior

Testing will be introduced progressively rather than all at once.

---

# 31. Development Order

The project will be built in the following general order:

```text
1. Project initialization
2. Node.js + Express
3. Basic health endpoint
4. ESM configuration
5. Environment configuration
6. Git initialization
7. GitHub repository
8. MongoDB + Mongoose
9. Database models
10. Authentication
11. Monitor CRUD
12. Monitoring architecture
13. Redis
14. BullMQ
15. Monitoring worker
16. Monitoring job scheduling
17. HTTP/API checker
18. Timeout handling
19. Retry handling
20. Check-result storage
21. Failure threshold
22. Incident engine
23. Incident lifecycle
24. Socket.IO
25. React dashboard
26. Monitoring analytics
27. Notifications
28. Maintenance windows
29. Public status page
30. Docker
31. Docker Compose
32. Testing
33. Deployment
34. Documentation
35. Resume/project description
36. Interview preparation
```

The exact implementation may adjust slightly if a technical dependency requires it, but we will not jump ahead unnecessarily.

---

# 32. Success Criteria

API Sentinel will be considered a successful completed project when:

* Users can securely authenticate.
* Users can create API monitors.
* Monitors can be enabled/disabled.
* APIs are checked automatically.
* Monitoring checks run through background workers.
* Redis and BullMQ manage monitoring jobs.
* Check results are stored in MongoDB.
* Response times and failures are recorded.
* Consecutive failures are detected.
* Incidents are automatically created.
* Incidents follow the defined lifecycle.
* API recovery automatically resolves incidents.
* Socket.IO provides real-time updates.
* The React dashboard displays monitoring information.
* Basic monitoring analytics are available.
* The application is tested.
* The application is Dockerized.
* The application can be deployed.
* The project is maintained using Git/GitHub.
* The developer can explain the architecture, request flow, trade-offs, and major implementation decisions in an interview.

---

# 33. Final Architecture

The final conceptual architecture is:

```text
                         USER
                           │
                           ▼
                    ┌─────────────┐
                    │    React    │
                    │  Dashboard  │
                    └──────┬──────┘
                           │
                     REST + JWT
                           │
                           ▼
                    ┌─────────────┐
                    │   Express   │
                    │ API Server  │
                    └──────┬──────┘
                           │
             ┌─────────────┼──────────────┐
             │             │              │
             ▼             ▼              ▼
         MongoDB         Redis        Socket.IO
                           │              │
                         BullMQ           │
                           │              │
                           ▼              │
                  ┌────────────────┐      │
                  │   Monitoring   │      │
                  │     Worker     │      │
                  └───────┬────────┘      │
                          │               │
                       HTTP/HTTPS         │
                          │               │
                          ▼               │
                     TARGET APIs          │
                          │               │
                          ▼               │
                       Worker             │
                          │               │
                          ▼               │
                       MongoDB            │
                          │               │
                          ▼               │
                   Incident Engine ──────┘
```

The three fundamental flows remain:

### Application Flow

```text
React
 ↓
Express
 ↓
MongoDB
```

### Monitoring Flow

```text
Express/Scheduler
 ↓
Redis + BullMQ
 ↓
Monitoring Worker
 ↓
Target API
 ↓
Worker
 ↓
MongoDB
```

### Real-Time Flow

```text
Worker
 ↓
Incident Engine
 ↓
Socket.IO
 ↓
React
```

These three flows are the core mental model of API Sentinel.

---

# 34. Project Boundary

API Sentinel is intentionally **not** being designed initially as:

* A microservices architecture
* A Kubernetes system
* A Kafka-based system
* A RabbitMQ-based system
* A PostgreSQL system
* A Spring Boot application
* A full enterprise observability platform

Those technologies may appear in other monitoring architectures, but they are outside the initial API Sentinel architecture.

The project will instead focus on understanding:

```text
Node.js
Express
MongoDB
Redis
BullMQ
Workers
Socket.IO
React
Docker
Git/GitHub
```

and how these components work together to create a real-world monitoring system.

---

# 35. Final Project Objective

The objective of API Sentinel is not simply to produce a portfolio application.

The developer should be able to explain:

* Why Node.js?
* Why Express?
* Why MongoDB?
* Why Redis?
* Why BullMQ?
* Why a background worker?
* Why not simply use `setInterval()` inside Express?
* How are monitoring jobs scheduled?
* How does the worker perform an API check?
* How are timeouts handled?
* How do retries work?
* How are false-positive incidents reduced?
* How does failure detection work?
* How is an incident created?
* How is an incident resolved?
* How does Socket.IO provide real-time updates?
* How could multiple workers scale the system?
* How are failed jobs handled?
* How could a dead-letter strategy be implemented?
* Where could a circuit breaker be useful?
* How would the system be Dockerized?
* How would the system be deployed?
* What are the architectural trade-offs?

The ultimate goal is to build the system **incrementally while understanding every major design decision**, rather than copying a finished project.
