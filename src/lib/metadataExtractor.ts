import * as cheerio from 'cheerio';
import { PageMetadata } from '@/types';

export class MetadataExtractor {
  private async fetchHTML(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SitemapAnalyzer/1.0; +https://github.com/jhs129/sitemapanalyzer)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractMetaTags($: cheerio.CheerioAPI): Partial<PageMetadata> {
    const metadata: Partial<PageMetadata> = {};

    // Basic meta tags
    metadata.title = $('title').first().text().trim() || undefined;
    metadata.metaDescription = $('meta[name="description"]').attr('content')?.trim() || undefined;
    metadata.metaKeywords = $('meta[name="keywords"]').attr('content')?.trim() || undefined;
    metadata.robots = $('meta[name="robots"]').attr('content')?.trim() || undefined;
    metadata.author = $('meta[name="author"]').attr('content')?.trim() || undefined;
    metadata.canonical = $('link[rel="canonical"]').attr('href')?.trim() || undefined;

    // Open Graph tags
    metadata.ogTitle = $('meta[property="og:title"]').attr('content')?.trim() || undefined;
    metadata.ogDescription = $('meta[property="og:description"]').attr('content')?.trim() || undefined;
    metadata.ogImage = $('meta[property="og:image"]').attr('content')?.trim() || undefined;
    metadata.ogUrl = $('meta[property="og:url"]').attr('content')?.trim() || undefined;
    metadata.ogType = $('meta[property="og:type"]').attr('content')?.trim() || undefined;
    metadata.ogSiteName = $('meta[property="og:site_name"]').attr('content')?.trim() || undefined;

    // Twitter Card tags
    metadata.twitterCard = $('meta[name="twitter:card"]').attr('content')?.trim() || undefined;
    metadata.twitterSite = $('meta[name="twitter:site"]').attr('content')?.trim() || undefined;
    metadata.twitterCreator = $('meta[name="twitter:creator"]').attr('content')?.trim() || undefined;
    metadata.twitterTitle = $('meta[name="twitter:title"]').attr('content')?.trim() || undefined;
    metadata.twitterDescription = $('meta[name="twitter:description"]').attr('content')?.trim() || undefined;
    metadata.twitterImage = $('meta[name="twitter:image"]').attr('content')?.trim() || undefined;

    return metadata;
  }

  async extractMetadata(url: string): Promise<PageMetadata> {
    const result: PageMetadata = { url };
    
    try {
      const html = await this.fetchHTML(url);
      const $ = cheerio.load(html);
      
      const metadata = this.extractMetaTags($);
      Object.assign(result, metadata);
      
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error';
    }
    
    return result;
  }

  async extractMetadataFromUrls(
    urls: string[], 
    onProgress?: (processed: number, total: number, currentUrl: string) => void
  ): Promise<PageMetadata[]> {
    const results: PageMetadata[] = [];
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      if (onProgress) {
        onProgress(i, urls.length, url);
      }
      
      const metadata = await this.extractMetadata(url);
      results.push(metadata);
      
      // Add a small delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (onProgress) {
      onProgress(urls.length, urls.length, '');
    }
    
    return results;
  }
}