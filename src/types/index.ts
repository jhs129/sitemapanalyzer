export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

export interface SitemapIndex {
  loc: string;
  lastmod?: string;
}

export interface PageMetadata {
  url: string;
  title?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  ogSiteName?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
  canonical?: string;
  author?: string;
  error?: string;
}

export interface AnalysisProgress {
  totalUrls: number;
  processedUrls: number;
  currentUrl?: string;
  isComplete: boolean;
  hasErrors: boolean;
  errors: string[];
}