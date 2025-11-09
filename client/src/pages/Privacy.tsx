import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <h1 className="text-2xl font-bold">SourceVerify</h1>
            </Link>
            <Button variant="outline" asChild>
              <Link href="/" data-testid="button-back-home">
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: November 9, 2025
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                SourceCheck is designed with privacy in mind. We believe in transparency about what data we collect and how we use it.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Collection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">What We Collect</h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li>
                  <strong>Input Text:</strong> The text you submit for verification is temporarily processed to extract claims and verify sources. This data is not stored permanently.
                </li>
                <li>
                  <strong>Source URLs:</strong> URLs cited in your input text are accessed to retrieve source content for verification purposes.
                </li>
                <li>
                  <strong>Technical Logs:</strong> Standard server logs may include IP addresses, browser information, and timestamps for security and debugging purposes.
                </li>
              </ul>

              <h3 className="font-semibold mt-6">What We Don't Collect</h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li>We do not create user accounts or store personal information</li>
                <li>We do not track your browsing behavior across other websites</li>
                <li>We do not sell, rent, or share your data with third parties for marketing purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                When you submit text for verification:
              </p>
              <ol className="space-y-2 ml-6 list-decimal">
                <li>Your input is sent to our backend server for processing</li>
                <li>The text is analyzed using AI services (OpenAI) to extract claims</li>
                <li>Source URLs are accessed to retrieve publicly available content</li>
                <li>AI services compare claims against source content</li>
                <li>Results are returned to you and temporarily cached for your session</li>
              </ol>
              <p className="mt-4">
                <strong>Session Data:</strong> Verification results are only stored in your browser's memory during your current session. When you close the tab or start a new verification, previous results are cleared.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                SourceCheck uses the following third-party services:
              </p>
              <ul className="space-y-3 ml-6 list-disc">
                <li>
                  <strong>OpenAI:</strong> For AI-powered claim extraction and verification. Text you submit is processed by OpenAI's API according to their privacy policy and data usage policies.
                </li>
                <li>
                  <strong>Web Sources:</strong> When you provide source URLs, our system fetches publicly available content from those websites to perform verification.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We implement security measures to protect your data:
              </p>
              <ul className="space-y-2 ml-6 list-disc">
                <li>All communication between your browser and our servers uses HTTPS encryption</li>
                <li>We implement SSRF (Server-Side Request Forgery) protections to prevent malicious URL access</li>
                <li>Input validation and sanitization to prevent injection attacks</li>
                <li>Rate limiting to prevent abuse</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Since SourceVerify does not permanently store personal data or create user accounts, there is no persistent data to access, modify, or delete. Each verification session is independent and temporary.
              </p>
              <p>
                If you have concerns about data that may have been logged for technical purposes, please contact us.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                SourceVerify does not use cookies for tracking or analytics. Any session cookies used are strictly for technical functionality and are deleted when you close your browser.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may update this privacy policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have questions about this privacy policy or how we handle your data, please reach out through our GitHub repository.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors" data-testid="link-about">
              About
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-privacy">
              Privacy
            </Link>
            <a 
              href="https://github.com/qqilihq/SourceVerify" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-foreground transition-colors"
              data-testid="link-github"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
