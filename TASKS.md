# AURA Customer Support - UI/UX & Codebase Overhaul

## Overview
This document outlines a deep UI/UX and Codebase Overhaul for the AURA-customer-support project, along with a comprehensive Auth & Demo Mode feature addition. The goal is to elevate the user interface utilizing the "Prism Glass" aesthetic theme, optimize component structure, refine codebase quality, and implement robust authentication, profile maintenance, and administrative capabilities while maintaining a frictionless demo experience.

## Project Analysis
- **Tech Stack**: Next.js 14, React 18, Tailwind CSS, Recharts, Lucide React, TypeScript.
- **Frontend Components identified**: `AgentNetworkDiagram`, `ChurnRadar`, `CommandPalette`, `ConfidenceGauge`, `ContextCapsuleCard`, `EvidencePanel`, `Nav`, `ReasoningTimeline`, `ToastStack`, `TrendingIssues`.

## Roadmap

### Phase 1: START
- [x] **Dependency Audit**: Review current versions of React (18.3.1), Next.js (14.2.5), Tailwind CSS (3.4.7), and Recharts (2.12.7). Check for minor updates and security patches.
- [x] **Design System Exploration**: Define the exact color palettes, typography, and backdrop-blur properties required for the Prism Glass theme.
- [x] **Codebase Familiarization**: Understand the existing data flow in the `app/` routes (dashboard, analytics, topology, workflow, ingestion) and how components map to them.
- [ ] **Auth System Planning**: Define strategy for implementing Auth (Login/Register), Profile maintenance, Admin capabilities, and a "Text Demo Mode".

### Phase 2: PLAN
- [x] **Theme Architecture**: Plan the integration of Prism Glass theme into `tailwind.config.ts` and `app/globals.css`. 
- [x] **Component Refactoring Strategy**: Target monolithic components to split them into smaller, reusable UI atoms.
- [x] **UX Enhancements Planning**: Map out micro-interactions for data-heavy components.
- [x] **State Management Review**: Determine if the current state handling within components needs a unified context.
- [x] **Auth Data Model**: Design models for User, Profile, and Roles (Admin vs User).
- [x] **Demo Mode Logic**: Define how "Text Demo Mode" bypasses credentials but tracks session state.

### Phase 3: BUILD
- [x] **Global Styling Implementation**: Update `globals.css` with CSS variables for glassmorphism effects.
- [x] **Tailwind Configuration**: Extend `tailwind.config.ts` with custom utilities.
- [x] **Component Overhaul**: Core UI & Data Visualization.
- [x] **Auth Components**: Implement `Login`, `Register`, and `Profile` components matching the Prism Glass theme.
- [x] **Auth Context/State**: Implement session management (mock or JWT based if backend is not strict) for handling login, demo mode, and admin checks.
- [x] **Admin Capabilities**: Implement admin dashboard/view with role-based access control.
- [x] **Text Demo Mode**: Implement a frictionless entry point for users to test the app without registering.

### Phase 4: VERIFY
- [x] **Visual Testing**: Ensure theme renders correctly.
- [x] **Accessibility Audit**: Check contrast ratios.
- [x] **Performance Profiling**: Analyze the updated Next.js build.
- [x] **Auth Flow Testing**: Verify Login, Register, Profile updates, Admin access, and Demo mode flows.


### Phase 5: UI/UX Updates
- [x] Search codebase for purple/violet colors
- [x] Replace purple/violet with clean, professional, enterprise-friendly color palette (blue/slate/indigo)

