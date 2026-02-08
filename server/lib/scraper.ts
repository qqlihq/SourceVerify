import axios from "axios";
import * as cheerio from "cheerio";
import pLimit from "p-limit";

export interface ScrapedContent {
  url: string;
  text: string;
  title?: string;
  error?: string;
}

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function getBrowserHeaders(userAgent: string): Record<string, string> {
  return {
    "User-Agent": userAgent,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "DNT": "1",
  };
}

// Validate URL to prevent SSRF attacks
function isUrlSafe(url: string): { safe: boolean; error?: string } {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { safe: false, error: 'Only HTTP and HTTPS protocols are allowed' };
    }
    
    // Block localhost and private IP ranges
    const hostname = parsed.hostname.toLowerCase();
    
    // Block localhost variants
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return { safe: false, error: 'Cannot fetch from localhost' };
    }
    
    // Block private IP ranges (simplified check)
    if (
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('172.17.') ||
      hostname.startsWith('172.18.') ||
      hostname.startsWith('172.19.') ||
      hostname.startsWith('172.20.') ||
      hostname.startsWith('172.21.') ||
      hostname.startsWith('172.22.') ||
      hostname.startsWith('172.23.') ||
      hostname.startsWith('172.24.') ||
      hostname.startsWith('172.25.') ||
      hostname.startsWith('172.26.') ||
      hostname.startsWith('172.27.') ||
      hostname.startsWith('172.28.') ||
      hostname.startsWith('172.29.') ||
      hostname.startsWith('172.30.') ||
      hostname.startsWith('172.31.')
    ) {
      return { safe: false, error: 'Cannot fetch from private IP addresses' };
    }
    
    // Block cloud metadata endpoints
    if (hostname === '169.254.169.254' || hostname.includes('metadata')) {
      return { safe: false, error: 'Cannot fetch from metadata endpoints' };
    }
    
    return { safe: true };
  } catch (error) {
    return { safe: false, error: 'Invalid URL format' };
  }
}

async function attemptFetch(url: string, headers: Record<string, string>, timeout: number) {
  return axios.get(url, {
    timeout,
    headers,
    maxRedirects: 5,
    validateStatus: (status) => status < 500,
  });
}

function parseHtml(html: string): { text: string; title: string } {
  const $ = cheerio.load(html);

  $('script, style, nav, header, footer, iframe, noscript, aside, [role="banner"], [role="navigation"]').remove();

  const title = $('title').text().trim() || $('h1').first().text().trim();

  let text = $('article').text() || $('main').text() || $('[role="main"]').text() || $('body').text();

  text = text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();

  const maxLength = 10000;
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + "...";
  }

  return { text, title };
}

export async function fetchSourceContent(url: string): Promise<ScrapedContent> {
  const validation = isUrlSafe(url);
  if (!validation.safe) {
    return {
      url,
      text: "",
      error: validation.error || "URL not allowed",
    };
  }

  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const userAgent = getRandomUserAgent();
      const headers = getBrowserHeaders(userAgent);

      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }

      const response = await attemptFetch(url, headers, 15000);

      if (response.status === 403 || response.status === 429) {
        console.warn(`Attempt ${attempt + 1}/${maxRetries}: Got ${response.status} for ${url}`);
        if (attempt < maxRetries - 1) continue;
        return {
          url,
          text: "",
          error: `Source blocked access (HTTP ${response.status}). The website may restrict automated access.`,
        };
      }

      if (response.status >= 400) {
        return {
          url,
          text: "",
          error: `Source returned HTTP ${response.status}`,
        };
      }

      const { text, title } = parseHtml(response.data);

      if (!text || text.length < 50) {
        return {
          url,
          text: text || "",
          title,
          error: "Source page contained very little readable text",
        };
      }

      return { url, text, title };
    } catch (error: any) {
      console.error(`Attempt ${attempt + 1}/${maxRetries} error fetching ${url}:`, error.message);
      if (attempt < maxRetries - 1) continue;

      let errorMessage = "Failed to fetch content";
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        errorMessage = "Source took too long to respond";
      } else if (error.code === "ENOTFOUND") {
        errorMessage = "Source website not found";
      } else if (error.code === "ECONNREFUSED") {
        errorMessage = "Source refused the connection";
      } else if (error.message) {
        errorMessage = `Unable to fetch source content: ${error.message}`;
      }

      return { url, text: "", error: errorMessage };
    }
  }

  return { url, text: "", error: "Failed to fetch content after multiple attempts" };
}

export async function fetchMultipleSources(urls: string[]): Promise<ScrapedContent[]> {
  // Limit concurrent fetches to prevent overwhelming the server
  const limit = pLimit(5);
  const fetchPromises = urls.map(url => 
    limit(() => fetchSourceContent(url))
  );
  return await Promise.all(fetchPromises);
}
