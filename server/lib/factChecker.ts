import axios from "axios";
import * as cheerio from "cheerio";
import pLimit from "p-limit";
import type { FactCheckResult } from "@shared/schema";
import { createChatCompletion } from "./openai";

const FACT_CHECK_SITES = [
  { name: "Snopes", searchUrl: "https://www.snopes.com/?s=", domain: "snopes.com" },
  { name: "PolitiFact", searchUrl: "https://www.politifact.com/search/?q=", domain: "politifact.com" },
  { name: "FactCheck.org", searchUrl: "https://www.factcheck.org/?s=", domain: "factcheck.org" },
  { name: "Full Fact", searchUrl: "https://fullfact.org/search/?q=", domain: "fullfact.org" },
  { name: "AFP Fact Check", searchUrl: "https://factcheck.afp.com/search?query=", domain: "factcheck.afp.com" },
  { name: "Reuters Fact Check", domain: "reuters.com/fact-check" },
  { name: "AP Fact Check", domain: "apnews.com/hub/ap-fact-check" },
  { name: "BBC Reality Check", domain: "bbc.com/news/reality_check" },
  { name: "Washington Post Fact Checker", domain: "washingtonpost.com/politics/fact-checker" },
  { name: "USA Today Fact Check", domain: "usatoday.com/news/factcheck" },
  { name: "Correctiv Faktencheck", searchUrl: "https://correctiv.org/faktencheck/?s=", domain: "correctiv.org/faktencheck" },
  { name: "ARD Faktenfinder", domain: "tagesschau.de/faktenfinder" },
  { name: "DW Fact Check", domain: "dw.com/en/fact-check" },
  { name: "Science Feedback", domain: "science.feedback.org" },
  { name: "Health Feedback", domain: "healthfeedback.org" },
  { name: "Climate Feedback", domain: "climatefeedback.org" },
  { name: "EUvsDisinfo", searchUrl: "https://euvsdisinfo.eu/?s=", domain: "euvsdisinfo.eu" },
  { name: "Le Monde Les Décodeurs", domain: "lemonde.fr/les-decodeurs" },
  { name: "Newtral", domain: "newtral.es" },
  { name: "Maldita.es", domain: "maldita.es" },
  { name: "Africa Check", searchUrl: "https://africacheck.org/?s=", domain: "africacheck.org" },
  { name: "Chequeado", domain: "chequeado.com" },
  { name: "Pagella Politica", domain: "pagellapolitica.it" },
  { name: "Alt News", domain: "altnews.in" },
  { name: "BoomLive", domain: "boomlive.in" },
  { name: "Teyit", domain: "teyit.org" },
  { name: "Rappler Fact Check", domain: "rappler.com/newsbreak/fact-check" },
  { name: "Skeptical Science", domain: "skepticalscience.com" },
];

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
];

function getHeaders(): Record<string, string> {
  const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  return {
    "User-Agent": ua,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,de;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "DNT": "1",
  };
}

async function searchGoogleFactCheckApi(
  claim: string,
  apiKey: string
): Promise<FactCheckResult[]> {
  try {
    const response = await axios.get(
      "https://factchecktools.googleapis.com/v1alpha1/claims:search",
      {
        params: {
          query: claim,
          key: apiKey,
          languageCode: "en",
          pageSize: 5,
        },
        timeout: 10000,
      }
    );

    if (!response.data?.claims) return [];

    return response.data.claims
      .filter((c: any) => c.claimReview && c.claimReview.length > 0)
      .flatMap((c: any) =>
        c.claimReview.map((review: any) => ({
          source: review.publisher?.name || "Unknown",
          rating: review.textualRating || undefined,
          title: review.title || c.text || "Fact Check",
          url: review.url || "",
          date: review.reviewDate
            ? new Date(review.reviewDate).toLocaleDateString()
            : undefined,
          claimReviewed: c.text || undefined,
        }))
      )
      .slice(0, 8);
  } catch (error: any) {
    console.error("Google Fact Check API error:", error.message);
    return [];
  }
}

async function searchFactCheckSite(
  site: { name: string; searchUrl?: string; domain: string },
  query: string
): Promise<FactCheckResult[]> {
  if (!site.searchUrl) return [];

  try {
    const searchQuery = encodeURIComponent(query);
    const url = site.searchUrl + searchQuery;

    const response = await axios.get(url, {
      headers: getHeaders(),
      timeout: 8000,
      maxRedirects: 3,
      validateStatus: (s) => s < 500,
    });

    if (response.status >= 400) return [];

    const $ = cheerio.load(response.data);
    const results: FactCheckResult[] = [];

    $("a[href]").each((_i, el) => {
      if (results.length >= 3) return false;

      const $el = $(el);
      const href = $el.attr("href") || "";
      const text = $el.text().trim();

      const lowerText = text.toLowerCase();
      const skipPhrases = [
        "follow us", "subscribe", "sign up", "log in", "sign in",
        "cookie", "privacy", "terms of", "about us", "contact",
        "donate", "newsletter", "advertise", "copyright", "menu",
        "share", "tweet", "facebook", "twitter", "bluesky", "instagram",
        "read more", "load more", "next page", "previous",
      ];
      const isBoilerplate = skipPhrases.some((p) => lowerText.includes(p));

      if (
        !isBoilerplate &&
        text.length > 20 &&
        text.length < 300 &&
        href.includes(site.domain.split("/")[0]) &&
        !href.endsWith(site.searchUrl || "") &&
        !href.includes("?s=") &&
        !href.includes("search") &&
        !href.includes("tag/") &&
        !href.includes("category/") &&
        !href.includes("author/") &&
        !href.includes("page/") &&
        !href.includes("/about") &&
        !href.includes("/contact") &&
        !href.includes("/privacy") &&
        !href.includes("/terms")
      ) {
        const fullUrl = href.startsWith("http") ? href : `https://${site.domain.split("/")[0]}${href}`;
        if (!results.some((r) => r.url === fullUrl)) {
          results.push({
            source: site.name,
            title: text.substring(0, 200),
            url: fullUrl,
          });
        }
      }
    });

    return results;
  } catch (error: any) {
    console.warn(`Failed to search ${site.name}: ${error.message}`);
    return [];
  }
}

async function generateSearchQuery(claim: string): Promise<string> {
  try {
    const response = await createChatCompletion(
      [
        {
          role: "user",
          content: `Extract the core factual assertion from this claim into a concise search query (3-8 words, no quotes). Just return the query, nothing else.\n\nClaim: "${claim}"`,
        },
      ],
      { temperature: 0.1 }
    );
    return response.trim().replace(/"/g, "").substring(0, 100);
  } catch {
    const words = claim.split(/\s+/).slice(0, 8).join(" ");
    return words;
  }
}

export async function lookupFactChecks(claim: string): Promise<FactCheckResult[]> {
  const allResults: FactCheckResult[] = [];

  const searchQuery = await generateSearchQuery(claim);
  console.log(`Fact-check search query: "${searchQuery}"`);

  const googleApiKey = process.env.GOOGLE_FACT_CHECK_API_KEY;
  if (googleApiKey) {
    console.log("Using Google Fact Check Tools API...");
    const googleResults = await searchGoogleFactCheckApi(searchQuery, googleApiKey);
    allResults.push(...googleResults);
  }

  const sitesWithSearch = FACT_CHECK_SITES.filter((s) => s.searchUrl);
  const limit = pLimit(3);

  const topSites = sitesWithSearch.slice(0, 5);

  const siteResults = await Promise.all(
    topSites.map((site) =>
      limit(() => searchFactCheckSite(site, searchQuery))
    )
  );

  for (const results of siteResults) {
    allResults.push(...results);
  }

  const seen = new Set<string>();
  const deduplicated = allResults.filter((r) => {
    const key = r.url.replace(/\/+$/, "").toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (deduplicated.length > 3) {
    try {
      const ranked = await rankFactCheckResults(claim, deduplicated);
      return ranked.slice(0, 5);
    } catch {
      return deduplicated.slice(0, 5);
    }
  }

  return deduplicated.slice(0, 5);
}

async function rankFactCheckResults(
  claim: string,
  results: FactCheckResult[]
): Promise<FactCheckResult[]> {
  try {
    const resultSummaries = results.map((r, i) => ({
      index: i,
      source: r.source,
      title: r.title,
      rating: r.rating,
    }));

    const response = await createChatCompletion(
      [
        {
          role: "user",
          content: `Given this claim: "${claim}"

And these fact-check results:
${JSON.stringify(resultSummaries, null, 2)}

Return a JSON object with a "ranked" array containing the indices of the most relevant results, ordered from most to least relevant. Only include results that actually appear related to the claim. Example: {"ranked": [2, 0, 4]}`,
        },
      ],
      { responseFormat: "json_object", temperature: 0.1 }
    );

    const parsed = JSON.parse(response);
    const indices: number[] = parsed.ranked || [];

    const ranked = indices
      .filter((i) => i >= 0 && i < results.length)
      .map((i) => results[i]);

    return ranked.length > 0 ? ranked : results;
  } catch {
    return results;
  }
}

export function getFactCheckSearchLinks(query: string): Array<{ name: string; url: string }> {
  const encoded = encodeURIComponent(query);
  return [
    { name: "Snopes", url: `https://www.snopes.com/?s=${encoded}` },
    { name: "PolitiFact", url: `https://www.politifact.com/search/?q=${encoded}` },
    { name: "FactCheck.org", url: `https://www.factcheck.org/?s=${encoded}` },
    { name: "Full Fact", url: `https://fullfact.org/search/?q=${encoded}` },
    { name: "Correctiv", url: `https://correctiv.org/faktencheck/?s=${encoded}` },
    { name: "AFP Fact Check", url: `https://factcheck.afp.com/search?query=${encoded}` },
    { name: "Google Fact Check Explorer", url: `https://toolbox.google.com/factcheck/explorer/search/${encoded}` },
  ];
}
