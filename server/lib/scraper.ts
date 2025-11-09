import axios from "axios";
import * as cheerio from "cheerio";
import pLimit from "p-limit";

export interface ScrapedContent {
  url: string;
  text: string;
  title?: string;
  error?: string;
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

export async function fetchSourceContent(url: string): Promise<ScrapedContent> {
  try {
    // Validate URL for security (prevent SSRF)
    const validation = isUrlSafe(url);
    if (!validation.safe) {
      return {
        url,
        text: "",
        error: validation.error || "URL not allowed",
      };
    }

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);

    // Remove script, style, and other non-content elements
    $('script, style, nav, header, footer, iframe, noscript').remove();

    // Get title
    const title = $('title').text().trim() || $('h1').first().text().trim();

    // Extract text from body
    let text = $('body').text();

    // Clean up whitespace
    text = text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    // Limit text length to prevent overwhelming the AI
    const maxLength = 10000;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "...";
    }

    return {
      url,
      text,
      title,
    };
  } catch (error: any) {
    console.error(`Error fetching ${url}:`, error.message);
    return {
      url,
      text: "",
      error: error.message || "Failed to fetch content",
    };
  }
}

export async function fetchMultipleSources(urls: string[]): Promise<ScrapedContent[]> {
  // Limit concurrent fetches to prevent overwhelming the server
  const limit = pLimit(5);
  const fetchPromises = urls.map(url => 
    limit(() => fetchSourceContent(url))
  );
  return await Promise.all(fetchPromises);
}
