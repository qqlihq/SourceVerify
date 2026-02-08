# SourceVerify - AI Source Verification Tool

## Overview
SourceVerify is a web application that helps verify factual claims in AI-generated responses by automatically checking cited sources. It addresses the common problem of AI hallucinations and misattributed quantitative data.

## Purpose
Users can paste AI-generated text with source citations, and SourceVerify will:
1. Extract claims and their associated source URLs using AI
2. Fetch the actual content from cited sources
3. Use AI to verify whether each claim is actually supported by its source
4. Provide confidence scores and detailed explanations
5. Suggest alternative authoritative sources to strengthen, clarify, or correct claims
6. Check fact-checking databases for existing fact-checks on each claim

## Current State
The application is fully functional with:
- Frontend UI for inputting AI responses and viewing verification results
- Backend API that orchestrates the verification pipeline
- OpenAI integration for claim extraction and verification (via Replit AI Integrations)
- Web scraping with security protections (SSRF prevention)
- Color-coded verification statuses (verified/partial/failed)
- Fact-check database lookup (30+ fact-checking organizations)

## Project Architecture

### Frontend (`client/`)
- **React SPA** with TypeScript
- **Routing**: wouter
- **State Management**: React Query (TanStack Query)
- **UI Components**: Shadcn UI + Tailwind CSS
- **Key Pages**:
  - `Home.tsx` - Main verification interface
  - `About.tsx` - Project description, features, and how it works
  - `Privacy.tsx` - Comprehensive privacy policy

### Backend (`server/`)
- **Express.js** server
- **API Routes** (`routes.ts`):
  - `POST /api/verify` - Main verification endpoint
- **Core Libraries** (`lib/`):
  - `openai.ts` - OpenAI client with retry logic
  - `claimExtractor.ts` - AI-powered claim extraction
  - `scraper.ts` - Web scraping with SSRF protection
  - `verifier.ts` - AI-powered claim verification
  - `sourceSuggester.ts` - AI-powered alternative source recommendations
  - `factChecker.ts` - Fact-check database lookup (Google API + web scraping)

### Shared (`shared/`)
- **Type Definitions** (`schema.ts`):
  - Request/response schemas
  - Verification result types (including FactCheckResult)
  - Zod validation schemas

## Key Features
1. **AI-Powered Claim Extraction**: Automatically identifies factual claims and their source URLs from user input
2. **Secure Web Scraping**: Fetches source content with protections against SSRF attacks
3. **Intelligent Verification**: Uses GPT-5 to compare claims against actual source content
4. **Detailed Results**: Provides verification status, confidence scores, explanations, and source excerpts
5. **Alternative Source Suggestions**: AI-powered recommendations for authoritative sources to strengthen, clarify, or correct claims based on verification status
6. **Fact-Check Database Lookup**: Searches 30+ fact-checking organizations (Snopes, PolitiFact, Correctiv, AFP, etc.) for existing fact-checks on each claim. Dual approach: Google Fact Check Tools API (when key available) + direct web scraping of fact-check site search pages. Results are AI-ranked for relevance.
7. **Batch Processing**: Handles multiple claims efficiently with concurrency limits

## Recent Changes (November 9, 2025)
- Implemented full backend verification pipeline
- Added SSRF security protections for URL fetching
- Integrated OpenAI via Replit AI Integrations (no API key needed)
- Connected frontend to backend API
- Added error handling and user feedback
- Created About and Privacy pages with comprehensive content
- Implemented proper routing with wouter for all pages
- Fixed accessibility issues with interactive element nesting
- Added footer navigation across all pages with external GitHub link
- **NEW**: Implemented AI-powered alternative source suggestions feature
  - Suggests authoritative sources to strengthen verified claims (confidence < 90%)
  - Provides clarification sources for partially verified claims
  - Recommends correction sources for failed verifications
  - Displays suggestions with descriptions, URLs, and search queries
  - Contextual messaging based on verification status
- **NEW**: Improved web scraper resilience against 403 blocks
  - Rotating modern browser User-Agent strings
  - Full browser-like headers (Accept, Sec-Fetch-*, etc.)
  - Auto-retry (up to 3 attempts) for 403/429 responses
  - User-friendly error messages
- **NEW**: Progressive Web App (PWA) support
  - Web App Manifest for standalone display (no browser bar)
  - Service Worker for offline caching of app shell
  - App icons for home screen installation
  - Offline fallback page with friendly messaging
  - Apple iOS meta tags for native-like experience

## Recent Changes (February 8, 2026)
- **NEW**: Fact-check database lookup feature
  - Searches 30+ fact-checking organizations for existing fact-checks
  - Supported sites: Snopes, PolitiFact, FactCheck.org, Full Fact, AFP, Correctiv, EUvsDisinfo, Africa Check, and more
  - Dual approach: Google Fact Check Tools API (with GOOGLE_FACT_CHECK_API_KEY) + direct web scraping fallback
  - AI-generated search queries for better matching
  - AI-ranked results for relevance
  - Boilerplate link filtering to avoid irrelevant results
  - Results displayed with source name, rating badge, title, and direct links
  - Runs in parallel with source suggestions for speed

## User Preferences
- Clean, functional design prioritizing data clarity
- Color-coded verification statuses for quick scanning
- No persistent storage needed (stateless verification)

## Dependencies
### Frontend
- React, Wouter, TanStack Query
- Shadcn UI components
- Tailwind CSS

### Backend
- Express.js
- OpenAI SDK (via Replit AI Integrations)
- Axios (HTTP requests)
- Cheerio (HTML parsing)
- p-limit, p-retry (concurrency and retry logic)

## Running the Project
The application runs on a single command:
```bash
npm run dev
```
This starts both the Express backend and Vite frontend on port 5000.

## Security Considerations
- URL validation prevents SSRF attacks (blocks localhost, private IPs, metadata endpoints)
- Concurrency limits prevent resource exhaustion
- Retry logic with exponential backoff for API calls
- Input validation with Zod schemas

## Future Enhancements (Potential)
- Batch processing of multiple AI responses
- Verification history and saved reports
- PDF/document source support
- Exportable reports (PDF/CSV)
- Browser extension for one-click verification
