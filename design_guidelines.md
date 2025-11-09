# Design Guidelines: AI Source Verification Tool

## Design Approach
**System**: Clean, functional design inspired by Linear and Notion's information-dense interfaces, prioritizing readability and data clarity over visual flourish.

**Rationale**: This is a utility-focused tool for analyzing and verifying information. Users need immediate clarity on verification results, easy comparison of claims vs. sources, and efficient workflow navigation.

## Core Design Elements

### Typography
- **Primary Font**: Inter (via Google Fonts CDN)
- **Monospace Font**: JetBrains Mono (for URLs and code-like content)
- **Hierarchy**:
  - Page titles: `text-3xl font-bold`
  - Section headers: `text-xl font-semibold`
  - Claims/content: `text-base leading-relaxed` (optimized for reading)
  - Metadata/labels: `text-sm font-medium text-gray-600`
  - Supporting text: `text-sm text-gray-500`

### Layout System
- **Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16 (e.g., `p-4`, `gap-6`, `mb-8`)
- **Container Strategy**:
  - Main content: `max-w-7xl mx-auto px-6`
  - Reading content (claims/sources): `max-w-4xl` for optimal line length
  - Side-by-side comparisons: Two-column grid with `gap-6`
- **Vertical Rhythm**: Consistent `space-y-6` between major sections, `space-y-4` within components

### Component Library

**Navigation**
- Clean top bar with tool name, minimal navigation links
- Action buttons (New Verification, History) in top-right

**Input Interface**
- Large textarea for pasting AI-generated content
- Clear label: "Paste AI response with sources"
- Character count indicator
- Primary action button: "Verify Sources" (prominent, right-aligned)

**Verification Results Dashboard**
- Status overview card showing total claims verified, success rate
- List of individual verification cards, each containing:
  - Verification badge (top-left): Green checkmark / Yellow warning / Red X with icon
  - Claim text (prominent, quoted styling with left border)
  - Source URL (monospace, clickable, truncated with tooltip)
  - Confidence score (percentage with progress bar)
  - "View Details" expand/collapse

**Detailed Comparison View**
- Two-column split layout:
  - Left: Original claim with highlighting
  - Right: Source excerpt with matching/contradicting text highlighted
- Verdict section below with clear explanation
- Reference to specific section/paragraph in source

**Data Display Components**
- Cards with subtle borders (`border border-gray-200`)
- Status indicators using badge components with icons (Heroicons)
- Progress bars for confidence scores
- Collapsible sections for detailed analysis

### Icons
**Library**: Heroicons (via CDN)
- Verification status: CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon
- Actions: ArrowPathIcon (refresh), DocumentTextIcon, LinkIcon
- UI: ChevronDownIcon (expand), MagnifyingGlassIcon

### Visual Hierarchy
- **Emphasis through weight**: Bold for critical information (claims, verdicts)
- **Emphasis through spacing**: Generous whitespace around verification results
- **Emphasis through borders**: Subtle left borders for quoted content, status-colored for verification results

### Layout Patterns
- Single-page application with clear workflow stages
- Sticky header for consistent navigation
- Main content area with single-column for input, grid for results
- No hero section - immediate access to tool functionality
- Footer with minimal links (About, Privacy, GitHub)

### Accessibility
- High contrast text (gray-900 on white, white on dark backgrounds)
- Clear focus states on all interactive elements
- Semantic HTML structure with proper heading hierarchy
- ARIA labels for verification status indicators
- Keyboard navigation support for all features

### Images
**No hero image required** - This is a functional tool, not a marketing page. Focus remains on the interface and data presentation.