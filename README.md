# Citizen Voice India

MASTER PROMPT — SURYA NATIONAL PUBLIC GRIEVANCE & CIVIC IMPROVEMENT PLATFORM

Build a production-ready, full-stack web application for Surya Group of Industries called:

🇮🇳 SURYA JANSEVA

National Public Grievance, Civic Issues & Improvement Platform

The platform allows citizens across India to report public-service discomfort, civic infrastructure problems, service issues, and improvement suggestions, track their submissions, receive updates, and provide feedback.

This must be a REAL WORKING APPLICATION, not a static UI, prototype, mockup, or demo.

1. CORE OBJECTIVE

Create a trusted nationwide platform where:

Citizen → Submit Issue → Verification → Categorization → Assignment/Forwarding → Action → Resolution → Citizen Feedback

Every complaint must have a unique Grievance ID.

The system must support:

Public complaints

Civic infrastructure issues

Public-service problems

Suggestions for improvement

Location-based reporting

Image/video/document evidence

Complaint tracking

Status updates

Notifications

Administrative verification

Department/authority assignment

Escalation

Analytics

Citizen feedback

Duplicate complaint detection

Fraud/spam prevention

Role-based administration

Do NOT claim that Surya itself is a government authority unless explicitly configured as such.

Use wording such as:

"Surya JanSeva is a citizen platform for reporting public-service concerns and improvement suggestions."

Where necessary, include:

"Submission through this platform does not guarantee government action or resolution. Complaints may be reviewed and forwarded to the appropriate authority."

2. TECHNOLOGY STACK

Use a modern production-ready architecture.

Preferred stack:

Frontend:

React

TypeScript

Tailwind CSS

Responsive design

Modern component architecture

Backend:

Node.js

Express.js

TypeScript

Database:

PostgreSQL

Authentication:

Email/password

Mobile OTP architecture

Google authentication if practical

Secure session/token handling

Storage:

Secure cloud storage for images/videos/documents

Maps:

Google Maps or another reliable mapping provider

Location picker

GPS location detection

Reverse geocoding

Notifications:

In-app notifications

Email notification architecture

SMS/WhatsApp integration architecture where credentials are available

Deployment:

Frontend and backend must be deployable independently

Environment variables for secrets

No API keys hardcoded into source code

If the existing project already has a technology stack, inspect it first and preserve the existing architecture unless there is a strong technical reason to change it.

3. BRANDING

Brand name:

SURYA JANSEVA

Parent organization:

Surya Group of Industries

Tagline:

"Your Voice. Your City. A Better India."

Alternative supporting text:

"Report. Track. Improve."

Design should feel:

Trustworthy

National

Professional

Modern

Accessible

Civic-focused

Secure

Avoid making it look like a banking website or generic corporate dashboard.

Use a polished Indian civic-tech visual identity.

Support:

Light mode

Dark mode

Make the design fully responsive for:

Mobile

Tablet

Laptop

Desktop

4. LANDING PAGE

Create a highly polished homepage.

Hero section:

"Make Your Voice Heard."

Subheading:

"Report public-service problems, civic issues and improvement suggestions from anywhere in India."

Primary buttons:

Report an Issue

Track Complaint

Secondary buttons:

Explore Issues

How It Works

Show a visual India map or civic dashboard.

5. HOMEPAGE SECTIONS

Include:

Live Statistics

Display real database-driven statistics:

Total submissions

Under review

Forwarded

In progress

Resolved

Citizen suggestions

NEVER use fake hardcoded numbers.

If there is no data, display:

"0"

instead of fake statistics.

How It Works

Report

Verify

Forward

Resolve

Feedback

Issue Categories

Show attractive cards for:

Roads

Streetlights

Water

Sanitation

Waste Management

Public Transport

Healthcare

Education

Electricity

Environment

Public Safety

Accessibility

Government Services

Public Facilities

Other

Why Use Surya JanSeva?

Easy reporting

Location-based complaints

Evidence upload

Transparent tracking

Notifications

Citizen feedback

Data-driven civic improvement

6. CITIZEN REGISTRATION

Create registration/login.

Fields:

Full Name

Mobile Number

Email

Password

State

District

Preferred Language

Support:

Email verification

Mobile OTP architecture

Password reset

Secure logout

Do not store passwords in plaintext.

Use proper password hashing.

7. CITIZEN DASHBOARD

After login, show:

Overview

Cards:

My Complaints

Pending

In Progress

Resolved

My Suggestions

Recent Complaints

Display:

Grievance ID

Category

Location

Date

Current status

Priority

Last update

Quick Actions

Report an Issue

Track Complaint

Submit Suggestion

View Notifications

8. REPORT AN ISSUE

Create a professional multi-step complaint submission system.

STEP 1 — Select Type

Options:

Public Service Complaint

Civic Infrastructure Issue

Public Facility Issue

Safety Concern

Improvement Suggestion

Other

STEP 2 — Category

Dynamic categories.

STEP 3 — Description

Fields:

Title

Detailed description

What happened?

How is the public affected?

Suggested improvement (optional)

Add character limits and validation.

STEP 4 — LOCATION

Allow:

Use current location

Select location on map

Search address manually

Capture:

State

District

City/Town/Village

Locality

Latitude

Longitude

Do NOT expose exact citizen home addresses publicly.

STEP 5 — EVIDENCE

Allow:

Images

Videos

PDF/documents

Show upload progress.

Validate:

File type

File size

Number of files

Compress images when appropriate.

STEP 6 — REVIEW

Show the complete submission before sending.

STEP 7 — SUBMIT

Generate a unique ID such as:

SJ-2026-000001

Do NOT generate IDs only on the frontend.

Generate them securely on the backend/database.

After submission show:

"Your grievance has been successfully submitted."

Display:

Grievance ID

Submission date

Category

Location

Status

Provide:

Track Grievance

button.

9. COMPLAINT STATUS SYSTEM

Use these statuses:

Submitted

Under Verification

Verified

Assigned

Forwarded

Action Initiated

In Progress

Resolved

Closed

Rejected

Duplicate

Escalated

Create a visual timeline.

Example:

✓ Submitted
↓
✓ Under Verification
↓
✓ Verified
↓
✓ Forwarded
↓
● Action Initiated
↓
○ Resolved

Every status change must create a database event.

Store:

Previous status

New status

Timestamp

User/admin who changed it

Comment

Supporting evidence

10. TRACK COMPLAINT

Allow users to track using:

Grievance ID

Registered mobile/email where appropriate

Show:

Complaint title

Category

Location

Date

Current status

Timeline

Authority/department if appropriate

Updates

Attachments

Comments

Escalation information

Do not expose private citizen information publicly.

11. PUBLIC ISSUE EXPLORER

Create an optional public map/dashboard showing privacy-safe aggregated issues.

Users can filter:

State

District

Category

Status

Date

Priority

Map markers should NOT reveal sensitive personal information.

Clicking an issue should show:

Category

General area

Date

Status

Description summary

Resolution status

Hide:

Citizen phone number

Email

Exact private address

Sensitive attachments

12. DUPLICATE DETECTION

Implement duplicate detection.

When a citizen submits an issue:

Compare against existing complaints using:

Geographic proximity

Category

Text similarity

Time period

If likely duplicate:

Show:

"This issue may already have been reported."

Allow:

View existing issue

Support existing issue

Continue submitting

Do not automatically reject unless the confidence threshold is high and an admin rule allows it.

13. ADMIN PORTAL

Create a completely separate secure admin dashboard.

Admin roles:

SUPER ADMIN

Can:

Manage everything

Manage admins

Manage departments

Configure categories

Configure workflows

View analytics

Audit activity

VERIFICATION ADMIN

Can:

Review complaints

Verify/reject

Detect duplicates

Request additional information

DEPARTMENT ADMIN

Can:

View assigned complaints

Update progress

Add comments

Upload resolution evidence

Mark action completed

MODERATOR

Can:

Review inappropriate content

Moderate public descriptions

Handle spam

Use strict role-based access control.

14. ADMIN DASHBOARD

Show real database data.

Cards:

Total Complaints

New Today

Pending Verification

Verified

Forwarded

In Progress

Resolved

Escalated

Rejected

Charts:

Complaints by State

Complaints by Category

Complaints by Status

Complaints over Time

Resolution Rate

Average Resolution Time

Map:

Show geographic issue density.

Do not use fake data.

15. COMPLAINT MANAGEMENT

Admin table:

Columns:

Grievance ID

Category

Citizen

Location

Date

Priority

Status

Assigned Department

Last Updated

Actions

Features:

Search

Filter

Sort

Pagination

Bulk actions where safe

Export CSV

Export PDF if practical

Complaint detail page:

Full complaint

Evidence

Location

Timeline

Internal notes

Citizen communication

Department assignment

Status controls

Escalation

Resolution evidence

16. DEPARTMENT / AUTHORITY MANAGEMENT

Create a system where administrators can configure departments/authorities.

Fields:

Department name

Jurisdiction

State

District

Categories handled

Contact information

Active/inactive

Allow complaints to be assigned or forwarded to the appropriate configured department.

Do NOT automatically claim that a department has received a complaint unless the system actually performs that forwarding.

17. ESCALATION SYSTEM

Allow administrators to configure escalation rules.

Example:

If complaint remains unresolved for X days:

→ Escalation Level 1

After additional time:

→ Escalation Level 2

Continue until configured maximum.

Show escalation timeline.

Notify responsible administrators.

Do not promise a government resolution deadline unless legally/operationally established.

18. CITIZEN SUGGESTIONS

Create a separate feature:

"Suggest an Improvement"

Citizen can submit:

Suggestion title

Description

Category

Location

Expected benefit

Optional evidence

Other citizens can:

Upvote

Comment

Share

Implement moderation and rate limits.

19. CITIZEN FEEDBACK

After resolution:

Ask:

"Was your issue resolved?"

Options:

Yes

Partially

No

Then:

Rating: 1–5

Optional comment

Store feedback.

Show administrators:

Satisfaction rate

Average rating

Unresolved feedback

Reopened complaints

Allow reopening where appropriate.

20. NOTIFICATION SYSTEM

Create an in-app notification center.

Notify citizens when:

Complaint submitted

Complaint verified

Complaint rejected

Complaint forwarded

Status changed

Admin requests information

Complaint resolved

Complaint reopened

Feedback requested

Notifications should be stored in the database.

Unread count must work.

Provide:

Mark as read

Mark all as read

21. EMAIL/SMS ARCHITECTURE

Create notification service abstraction.

Example:

NotificationService

with providers:

EmailProvider

SMSProvider

WhatsAppProvider

Use environment variables for credentials.

If credentials are not configured:

The application must continue working using in-app notifications.

Do not insert fake successful SMS/email messages.

22. MULTI-LANGUAGE SUPPORT

Prepare the application for Indian languages.

Initially support:

English

Hindi

Kannada

Architecture should allow adding:

Telugu

Tamil

Malayalam

Marathi

Bengali

Gujarati

Punjabi

Odia

Assamese

Urdu

Do not translate using hardcoded conditional logic throughout the application.

Use a proper internationalization structure.

23. ACCESSIBILITY

Follow WCAG principles.

Include:

Keyboard navigation

Proper labels

Screen-reader-friendly components

Sufficient contrast

Focus states

Large touch targets

Accessible forms

Error messages

24. SECURITY

Implement:

Password hashing

Secure authentication

Authorization middleware

RBAC

Input validation

SQL injection protection

XSS protection

CSRF protection where applicable

Rate limiting

File upload validation

MIME validation

File size limits

Secure headers

Audit logging

Session/token expiration

Brute-force protection

Never expose:

Database credentials

API keys

JWT secrets

Service account keys

in frontend code.

25. PRIVACY

Create:

Privacy Policy page

Terms of Use page

Grievance submission guidelines

Community guidelines

Collect only information required for the service.

Provide appropriate consent mechanisms.

Do not publicly expose:

Phone numbers

Emails

Passwords

Private addresses

Sensitive evidence

Government IDs

26. MODERATION

Detect and handle:

Spam

Abusive content

Threats

Malicious uploads

Duplicate complaints

Fake reports

Create moderation tools for administrators.

Do not silently delete legitimate complaints.

Maintain audit logs for moderation actions.

27. SEARCH

Global search should support:

Grievance ID

Category

State

District

Status

Keywords

Admins should have advanced filtering.

28. ANALYTICS

Create an analytics module.

Metrics:

Complaints per day/week/month

Complaints by state

Complaints by district

Category distribution

Resolution rate

Average response time

Average resolution time

Escalation rate

Reopening rate

Citizen satisfaction

Duplicate rate

Charts must use actual database data.

29. AUDIT LOG

Every sensitive administrative action must be logged.

Example:

Admin:
Admin ID

Action:
"Changed complaint status"

Complaint:
SJ-2026-000001

Old status:
Verified

New status:
Forwarded

Timestamp:
Database timestamp

IP/device information where legally appropriate.

Audit logs must be immutable to normal administrators.

30. DATABASE DESIGN

Create proper relational database tables.

At minimum:

users
roles
permissions
user_roles
complaints
complaint_categories
complaint_status_history
complaint_attachments
complaint_comments
departments
department_assignments
locations
suggestions
suggestion_votes
suggestion_comments
notifications
feedback
escalations
audit_logs
moderation_actions

Use:

Primary keys

Foreign keys

Indexes

Unique constraints

Timestamps

Proper cascading rules

Do not put the entire application into one database table.

31. API ARCHITECTURE

Create clean REST APIs.

Example:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

GET /api/complaints
POST /api/complaints
GET /api/complaints/:id
PATCH /api/complaints/:id

POST /api/complaints/:id/comments
POST /api/complaints/:id/feedback
POST /api/complaints/:id/escalate

GET /api/categories
GET /api/departments

GET /api/notifications
PATCH /api/notifications/:id/read

POST /api/suggestions
GET /api/suggestions

GET /api/admin/dashboard
GET /api/admin/analytics
GET /api/admin/audit-logs

Protect every sensitive endpoint using proper authorization middleware.

32. ERROR HANDLING

Never show raw server/database errors to users.

Create friendly messages such as:

"Something went wrong. Please try again."

"Your complaint could not be submitted. Please check your internet connection."

Handle:

Network failures

Validation errors

Authentication failures

Permission errors

Upload failures

Database failures

API failures

33. LOADING STATES

Every asynchronous operation must have proper UI states.

Implement:

Skeleton loaders

Spinners where appropriate

Upload progress

Disabled buttons while submitting

Success messages

Error messages

Empty states

Never leave the user wondering whether a request worked.

34. MOBILE EXPERIENCE

The mobile experience is extremely important.

Design for citizens using smartphones.

The Report Issue flow should be possible comfortably with one hand.

Include:

Camera upload

GPS location

Large buttons

Bottom navigation where appropriate

Responsive forms

35. ADMIN MOBILE RESPONSIVENESS

Admin dashboard should also work on tablets and mobile.

Tables should become cards or horizontally scroll where necessary.

36. PERFORMANCE

Optimize:

Lazy loading

Image compression

Pagination

Database indexes

API response size

Caching where appropriate

Do not load thousands of complaints at once.

37. REAL-TIME UPDATES

Where practical, implement real-time updates for:

Complaint status

Notifications

Admin assignment

Citizen dashboard

If WebSockets are used, implement proper authentication and cleanup.

38. DEMO / SEED DATA

Create a database seed script for development only.

Seed data must be clearly marked as DEMO data.

Production must start with real empty data.

Never present seeded/demo complaints as real public complaints.

39. ENVIRONMENT CONFIGURATION

Create:

.env.example

Include placeholders such as:

DATABASE_URL=
JWT_SECRET=
GOOGLE_MAPS_API_KEY=
STORAGE_BUCKET=
EMAIL_API_KEY=
SMS_API_KEY=

Never commit actual credentials.

Create clear setup documentation.

40. TESTING

Implement tests for critical functionality.

At minimum test:

Registration

Login

Complaint submission

Complaint ID generation

Complaint retrieval

Status updates

RBAC

Admin access

File validation

Feedback submission

Notification creation

Duplicate detection

API error handling

41. FINAL QUALITY REQUIREMENT

Before considering the project complete, test the entire application as a real user.

Perform this flow:

Register citizen

Login

Submit complaint

Upload image

Select GPS/map location

Receive grievance ID

Track complaint

Login as verification admin

Verify complaint

Assign department

Update status

Add comment

Login as citizen

Confirm notification

View updated complaint

Resolve complaint

Submit citizen feedback

Verify analytics update

Every step must actually work.

Do not use fake buttons.

Do not create buttons that only show "Coming Soon" unless the feature genuinely cannot be implemented without an external service.

42. UI QUALITY

The website must look like a serious nationwide platform.

Avoid:

Generic AI-generated layouts

Excessive gradients

Huge unnecessary animations

Fake statistics

Placeholder buttons

Lorem ipsum

Broken navigation

Inconsistent spacing

Poor mobile layouts

Use:

Professional typography

Consistent design system

Clear hierarchy

Subtle animations

Accessible components

Excellent forms

Clean dashboards

Professional maps

Meaningful empty states

43. IMPORTANT DEVELOPMENT RULE

Before writing code:

Inspect the existing project.

Identify current framework.

Identify existing components.

Identify existing database/backend.

Reuse working code where possible.

Do not unnecessarily rewrite the project.

Create a clear implementation plan.

Then implement feature-by-feature.

Test each feature after implementation.

Fix errors before moving to the next feature.

Do not stop after creating the frontend.

The final result must contain:

Frontend + Backend + Database + Authentication + File Storage + APIs + Admin Portal + Notifications + Validation + Security + Testing.

44. DEFINITION OF DONE

The project is complete ONLY when:

✅ Citizen registration works
✅ Login works
✅ Logout works
✅ Complaint submission works
✅ Complaint ID generation works
✅ Location selection works
✅ Evidence upload works
✅ Complaint tracking works
✅ Status timeline works
✅ Admin login works
✅ RBAC works
✅ Admin verification works
✅ Department assignment works
✅ Status changes work
✅ Notifications work
✅ Suggestions work
✅ Citizen feedback works
✅ Analytics use real database data
✅ Search works
✅ Filters work
✅ Pagination works
✅ Audit logs work
✅ Security validation works
✅ Mobile responsive design works
✅ Error handling works
✅ Database migrations work
✅ Seed script works
✅ Production environment configuration exists
✅ No fake functionality remains
✅ No broken buttons remain
✅ No hardcoded production credentials exist

45. FINAL INSTRUCTION TO THE AI CODING AGENT

Do NOT simply generate a landing page.

Build the complete application.

If a feature requires an external API or credential that is unavailable, implement the complete abstraction, configuration, backend integration structure, error handling, and UI—but clearly indicate the missing environment variable/configuration rather than pretending the integration succeeded.

After implementation, run the application, test all major flows, inspect the browser console and server logs, fix errors, and only then consider the task complete.

The final application should feel like a real nationwide civic-tech platform, not a hackathon mockup.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://surya-janseva-connect.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9cf00675-b091-4adc-bd8e-eadf071e71dd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
