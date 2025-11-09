# SourceCheck - AI Source Verification Tool

## Overview
SourceCheck is a web application that helps verify factual claims in AI-generated responses by automatically checking cited sources. It addresses the common problem of AI hallucinations and misattributed quantitative data.

## Purpose
Users can paste AI-generated text with source citations, and SourceCheck will:
1. Extract claims and their associated source URLs using AI
2. Fetch the actual content from cited sources
3. Use AI to verify whether each claim is actually supported by its source
4. Provide confidence scores and detailed explanations

## Current State
The application is fully functional with:
- Frontend UI for inputting AI responses and viewing verification results
- Backend API that orchestrates the verification pipeline
- OpenAI integration for claim extraction and verification (via Replit AI Integrations)
- Web scraping with security protections (SSRF prevention)
- Color-coded verification statuses (verified/partial/failed)

## Project Architecture

### Frontend (`client/`)
- **React SPA** with TypeScript
- **Routing**: wouter
- **State Management**: React Query (TanStack Query)
- **UI Components**: Shadcn UI + Tailwind CSS
- **Key Pages**:
  - `Home.tsx` - Main verification interface

### Backend (`server/`)
- **Express.js** server
- **API Routes** (`routes.ts`):
  - `POST /api/verify` - Main verification endpoint
- **Core Libraries** (`lib/`):
  - `openai.ts` - OpenAI client with retry logic
  - `claimExtractor.ts` - AI-powered claim extraction
  - `scraper.ts` - Web scraping with SSRF protection
  - `verifier.ts` - AI-powered claim verification

### Shared (`shared/`)
- **Type Definitions** (`schema.ts`):
  - Request/response schemas
  - Verification result types
  - Zod validation schemas

## Key Features
1. **AI-Powered Claim Extraction**: Automatically identifies factual claims and their source URLs from user input
2. **Secure Web Scraping**: Fetches source content with protections against SSRF attacks
3. **Intelligent Verification**: Uses GPT-5 to compare claims against actual source content
4. **Detailed Results**: Provides verification status, confidence scores, explanations, and source excerpts
5. **Batch Processing**: Handles multiple claims efficiently with concurrency limits

## Recent Changes (November 9, 2025)
- Implemented full backend verification pipeline
- Added SSRF security protections for URL fetching
- Integrated OpenAI via Replit AI Integrations (no API key needed)
- Connected frontend to backend API
- Added error handling and user feedback

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
