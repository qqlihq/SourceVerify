# SourceVerify

An AI-powered tool that verifies whether claims in AI-generated responses are actually supported by their cited sources. SourceVerify helps you quickly identify AI hallucinations and misrepresented data by automatically checking factual claims against their original sources.

## 🚀 Quick Links

- **Live Demo (Replit):** https://replit.com/@philipphamboeck/SourceVerify
- **Source Code (GitHub):** https://github.com/qqlihq/SourceVerify

## 📖 About

AI language models sometimes produce responses that sound authoritative but contain inaccurate information—a phenomenon known as "hallucination." Even when AI systems cite sources, the claims they make may not actually be supported by those sources, or quantitative data may be misrepresented.

SourceVerify automates the verification process by:
1. **Extracting claims** from AI-generated text using AI analysis
2. **Fetching source content** from cited URLs with security protections
3. **Verifying accuracy** by comparing claims against actual source content
4. **Providing results** with color-coded statuses, confidence scores, and detailed explanations

## ✨ Features

- 🤖 **Automated Claim Extraction** - AI identifies factual claims and their source citations
- 🌐 **Web Source Verification** - Fetches and analyzes content from any public web source
- ⚡ **AI-Powered Analysis** - Uses advanced language models to verify claim accuracy
- 🎯 **Confidence Scoring** - Provides 0-100% confidence scores with detailed explanations
- 🔒 **Security Protections** - SSRF prevention, rate limiting, and input validation
- 🎨 **Clean Interface** - Color-coded results (green/yellow/red) for quick scanning

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Wouter (routing)
- TanStack Query (state management)
- Shadcn UI + Tailwind CSS

### Backend
- Express.js
- OpenAI API (via Replit AI Integrations)
- Axios + Cheerio (web scraping)
- p-limit, p-retry (concurrency and retry logic)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- OpenAI API access (or use Replit AI Integrations)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/qqlihq/SourceVerify.git
cd SourceVerify
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env file with:
SESSION_SECRET=your-session-secret
# If not using Replit AI Integrations:
OPENAI_API_KEY=your-openai-api-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5000`

## 📝 Usage

1. Paste AI-generated text that includes claims with source citations
2. Click "Verify Sources"
3. Wait for the verification process (10-30 seconds depending on number of claims)
4. Review color-coded results:
   - 🟢 **Verified** - Claim is supported by the source
   - 🟡 **Partial** - Claim is partially supported or needs context
   - 🔴 **Failed** - Claim is not supported by the source

## 🔒 Security Features

- **SSRF Protection** - Validates URLs to block localhost, private IPs, and metadata endpoints
- **Concurrency Limits** - Prevents resource exhaustion
- **Retry Logic** - Exponential backoff for API calls
- **Input Validation** - Zod schemas for request validation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Replit](https://replit.com)
- Powered by [OpenAI](https://openai.com)
- UI components from [Shadcn UI](https://ui.shadcn.com)

## 📧 Contact

Created by [@qqlihq](https://github.com/qqlihq)

---

## 🎮 Try It Now

### Open in Replit
[![Open in Replit](https://replit.com/badge/github/qqlihq/SourceVerify)](https://replit.com/@philipphamboeck/SourceVerify)

### Embed on Your Website
```html
<iframe
  frameborder="0"
  width="100%"
  height="500"
  src="https://replit.com/@philipphamboeck/SourceVerify?lite=true">
</iframe>
```
