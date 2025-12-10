import * as SimpleIcons from 'simple-icons';

export interface IconRecord {
  title: string;
  slug: string;
  hex: string;
  path: string;
  source: string;
  relevanceScore?: number;
}

export interface AiExplanation {
  summary: string;
  matchReasons: string[];
}

// Interface for the raw icon data from simple-icons
interface SimpleIcon {
  title: string;
  slug: string;
  hex: string;
  path: string;
  source: string;
  [key: string]: any;
}

// Convert the imported object to an array of icon records
// Filtering out non-icon exports if any, though SimpleIcons usually just exports icons + generic utils
const ALL_ICONS: IconRecord[] = Object.values(SimpleIcons)
  .filter((icon: any) => icon && icon.title && icon.path)
  .map((icon: any) => {
    const i = icon as SimpleIcon;
    return {
      title: i.title,
      slug: i.slug,
      hex: i.hex,
      path: i.path,
      source: i.source,
    };
  });

// Basic Knowledge Graph / Category Mappings
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  social: ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'snapchat', 'whatsapp', 'discord', 'youtube', 'pinterest', 'reddit', 'telegram', 'bluesky', 'mastodon', 'threads', 'twitch'],
  dev: ['github', 'gitlab', 'react', 'typescript', 'javascript', 'node.js', 'python', 'rust', 'go', 'docker', 'kubernetes', 'vscode', 'intellij', 'vim', 'git', 'npm', 'yarn', 'pnpm'],
  cloud: ['amazonaws', 'googlecloud', 'azure', 'digitalocean', 'vercel', 'netlify', 'heroku', 'cloudflare', 'firebase', 'supabase', 'linode'],
  design: ['figma', 'sketch', 'adobe', 'dribbble', 'behance', 'canva', 'framer', 'penpot', 'blender', 'inkscape', 'photoshop', 'illustrator'],
  finance: ['stripe', 'paypal', 'visa', 'mastercard', 'amex', 'bitcoin', 'ethereum', 'binance', 'coinbase', 'wise', 'revolut', 'monzo', 'klarna', 'cashapp'],
  framework: ['next.js', 'nuxt', 'vue.js', 'svelte', 'angular', 'django', 'laravel', 'rails', 'spring', 'fastapi', 'flask', 'express', 'nest', 'bootstrap', 'tailwind'],
  database: ['postgresql', 'mysql', 'mongodb', 'redis', 'sqlite', 'elasticsearch', 'supabase', 'dynamodb', 'mariadb', 'cassandra', 'neo4j'],
  system: ['linux', 'windows', 'macos', 'ubuntu', 'debian', 'archlinux', 'android', 'ios', 'fedora', 'centos', 'redhat'],
  google: ['google', 'gmail', 'drive', 'maps', 'android', 'chrome', 'youtube'],
  microsoft: ['microsoft', 'windows', 'office', 'teams', 'azure', 'typescript', 'vscode', 'xbox', 'linkedin', 'github'],
  apple: ['apple', 'macos', 'ios', 'swift', 'appstore', 'music', 'icloud'],
  analytics: ['googleanalytics', 'plausible', 'fathom', 'mixpanel', 'amplitude', 'hotjar'],
  cms: ['wordpress', 'ghost', 'drupal', 'joomla', 'shopify', 'wix', 'squarespace', 'contentful', 'strapi', 'sanity'],
};

// Color Helper (HSO approximation)
// Range defines how strict the hue match is (in degrees)
const COLOR_MAP: Record<string, { hue: number; range: number; sMin?: number; lMin?: number; lMax?: number }> = {
  red: { hue: 0, range: 15 },
  orange: { hue: 30, range: 15 },
  yellow: { hue: 60, range: 15 },
  green: { hue: 120, range: 60 },
  cyan: { hue: 180, range: 30 },
  blue: { hue: 220, range: 40 },
  purple: { hue: 280, range: 30 },
  pink: { hue: 330, range: 20 },
  // Special handling for grayscale is done in logic
};

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let r = 0, g = 0, b = 0;
  if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16) / 255;
    g = parseInt(hex.substring(2, 4), 16) / 255;
    b = parseInt(hex.substring(4, 6), 16) / 255;
  }
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

function matchesColor(iconHex: string, targetColorName: string): boolean {
  const { h, s, l } = hexToHsl(iconHex);
  const target = COLOR_MAP[targetColorName];

  if (targetColorName === 'black') return l < 0.2;
  if (targetColorName === 'white') return l > 0.9;
  if (targetColorName === 'gray') return s < 0.2 && l >= 0.2 && l <= 0.9;

  if (target) {
    // Ignore desaturated colors when looking for a hue
    if (s < 0.2) return false; 
    
    // Check circular hue distance
    const diff = Math.abs(h - target.hue);
    const distance = Math.min(diff, 360 - diff);
    return distance <= target.range;
  }
  return false;
}

export function getIconSuggestions(query: string): { suggestions: IconRecord[]; explanation: AiExplanation } {
  const normalizedQuery = query.toLowerCase();
  const tokens = normalizedQuery.split(/\s+/).filter(t => t.length > 2 || ['c', 'r', 'go', 'ui'].includes(t)); // allow short tech names

  // 1. Extract intent filters
  const foundCategories: string[] = [];
  const foundColors: string[] = [];
  const searchKeywords: string[] = [];

  tokens.forEach(token => {
    // Check categories
    if (CATEGORY_KEYWORDS[token]) {
      foundCategories.push(token);
    }
    // Check colors
    else if (COLOR_MAP[token] || ['black', 'white', 'gray'].includes(token)) {
      foundColors.push(token);
    }
    // Regular keywords (stopwords removal)
    else if (!['icon', 'icons', 'logo', 'logos', 'svg', 'show', 'me', 'give', 'brand', 'brands', 'related', 'for', 'the', 'a', 'an', 'list', 'of'].includes(token)) {
      searchKeywords.push(token);
    }
  });

  // 2. Score icons
  const scoredIcons = ALL_ICONS.map(icon => {
    let score = 0;
    const titleLower = icon.title.toLowerCase();
    const slugLower = icon.slug.toLowerCase();

    // Exact matches (very high relevance)
    if (searchKeywords.some(k => titleLower === k || slugLower === k)) score += 50;

    // Partial matches
    searchKeywords.forEach(k => {
      if (titleLower.includes(k)) score += 10;
      if (slugLower.includes(k)) score += 8;
    });

    // Category relevance
    foundCategories.forEach(cat => {
      const brands = CATEGORY_KEYWORDS[cat] || [];
      // If the icon is in the manually mapped list for this category
      if (brands.some(b => slugLower.includes(b) || titleLower.includes(b))) {
        score += 25;
      }
      // Heuristic: if category name appears in title (e.g. "Google Cloud")
      if (titleLower.includes(cat)) score += 5;
    });

    // Color filtering (Soft filter: boosts score rather than hard exclude)
    if (foundColors.length > 0) {
      const matchesAnyColor = foundColors.some(c => matchesColor(icon.hex, c));
      if (matchesAnyColor) {
        score += 15;
      } else {
        // Penalty for mismatch if color was explicitly requested
        score -= 5;
      }
    }

    return { ...icon, relevanceScore: score };
  });

  // 3. Sort and slice
  const suggestions = scoredIcons
    .filter(i => (i.relevanceScore || 0) > 0)
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    .slice(0, 24);

  // 4. Generate Explanation
  const matchReasons: string[] = [];
  if (foundCategories.length > 0) {
    matchReasons.push(`Matched category: ${foundCategories.map(c => `"${c}"`).join(', ')}`);
  }
  if (foundColors.length > 0) {
    matchReasons.push(`Filtered by color: ${foundColors.join(', ')}`);
  }
  if (searchKeywords.length > 0) {
    matchReasons.push(`Matched keywords: ${searchKeywords.map(k => `"${k}"`).join(', ')}`);
  }

  const summary = suggestions.length > 0
    ? `Found ${suggestions.length} relevant icons based on your query.`
    : "No highly relevant icons found. Try broadening your terms.";

  return {
    suggestions,
    explanation: {
      summary,
      matchReasons
    }
  };
}