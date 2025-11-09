import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Globe, Shield, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2" data-testid="link-home">
                <h1 className="text-2xl font-bold">SourceCheck</h1>
              </a>
            </Link>
            <Link href="/">
              <Button variant="outline" data-testid="button-back-home">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">About SourceCheck</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              An AI-powered tool that verifies whether claims in AI-generated responses are actually supported by their cited sources.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>The Problem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                AI language models sometimes produce responses that sound authoritative but contain inaccurate information—a phenomenon known as "hallucination." Even when AI systems cite sources, the claims they make may not actually be supported by those sources, or quantitative data may be misrepresented.
              </p>
              <p>
                Manually checking each claim against its source is time-consuming and tedious. SourceCheck automates this verification process, helping you quickly identify which claims are truly backed by evidence.
              </p>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                    Extract Claims
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AI analyzes your input text to identify factual claims and their associated source URLs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                    Fetch Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The system securely retrieves the actual content from each cited source URL.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                    Verify Claims
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AI compares each claim against the source content to determine if it's supported.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">4</div>
                    Show Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Color-coded results show verification status, confidence scores, and detailed explanations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Automated Claim Extraction</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically identifies factual claims and their source citations without manual markup.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Globe className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Web Source Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Fetches and analyzes content from any publicly accessible web source.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Zap className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">AI-Powered Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Uses advanced language models to understand context and verify claim accuracy.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Confidence Scoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Provides 0-100% confidence scores and detailed explanations for each verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Use Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Research verification:</strong> Quickly check if AI-summarized research findings are accurate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Fact-checking:</strong> Verify quantitative data and statistics before using them</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Content review:</strong> Validate AI-generated content before publication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Educational tools:</strong> Help students learn to critically evaluate AI-generated information</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/">
              <Button size="lg" data-testid="button-try-now">
                Try SourceCheck Now
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/about">
              <a className="hover:text-foreground transition-colors" data-testid="link-about">About</a>
            </Link>
            <Link href="/privacy">
              <a className="hover:text-foreground transition-colors" data-testid="link-privacy">Privacy</a>
            </Link>
            <a 
              href="https://github.com" 
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
