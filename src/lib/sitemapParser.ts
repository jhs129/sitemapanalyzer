import xml2js from 'xml2js';
import { SitemapUrl, SitemapIndex } from '@/types';

export class SitemapParser {
  private async fetchXML(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch sitemap from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async parseXML(xmlContent: string): Promise<any> {
    const parser = new xml2js.Parser({ 
      explicitArray: false,
      ignoreAttrs: true,
      trim: true 
    });
    
    try {
      return await parser.parseStringPromise(xmlContent);
    } catch (error) {
      throw new Error(`Failed to parse XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private normalizeSitemapUrl(url: SitemapUrl | string): SitemapUrl {
    if (typeof url === 'string') {
      return { loc: url };
    }
    return url;
  }

  private normalizeSitemapIndex(index: SitemapIndex | string): SitemapIndex {
    if (typeof index === 'string') {
      return { loc: index };
    }
    return index;
  }

  async parseSitemap(sitemapUrl: string): Promise<SitemapUrl[]> {
    const xmlContent = await this.fetchXML(sitemapUrl);
    const parsed = await this.parseXML(xmlContent);
    
    // Check if this is a sitemap index
    if (parsed.sitemapindex) {
      return await this.parseSitemapIndex(parsed.sitemapindex);
    }
    
    // Regular sitemap
    if (parsed.urlset && parsed.urlset.url) {
      const urls = Array.isArray(parsed.urlset.url) 
        ? parsed.urlset.url 
        : [parsed.urlset.url];
      
      return urls.map((url: any) => this.normalizeSitemapUrl(url));
    }
    
    throw new Error('Invalid sitemap format: No urlset or sitemapindex found');
  }

  private async parseSitemapIndex(sitemapIndex: any): Promise<SitemapUrl[]> {
    const sitemaps = Array.isArray(sitemapIndex.sitemap) 
      ? sitemapIndex.sitemap 
      : [sitemapIndex.sitemap];
    
    const allUrls: SitemapUrl[] = [];
    
    // Process each sitemap in the index
    for (const sitemap of sitemaps) {
      const normalizedSitemap = this.normalizeSitemapIndex(sitemap);
      try {
        const urls = await this.parseSitemap(normalizedSitemap.loc);
        allUrls.push(...urls);
      } catch (error) {
        console.warn(`Failed to parse sitemap ${normalizedSitemap.loc}:`, error);
        // Continue with other sitemaps even if one fails
      }
    }
    
    return allUrls;
  }

  async getAllUrls(sitemapUrl: string): Promise<SitemapUrl[]> {
    try {
      return await this.parseSitemap(sitemapUrl);
    } catch (error) {
      throw new Error(`Failed to parse sitemap: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}