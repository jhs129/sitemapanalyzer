import { SitemapParser } from './sitemapParser';
import { MetadataExtractor } from './metadataExtractor';
import { CSVGenerator } from './csvGenerator';
import { PageMetadata, AnalysisProgress } from '@/types';

export class SitemapAnalyzer {
  private sitemapParser: SitemapParser;
  private metadataExtractor: MetadataExtractor;
  private csvGenerator: CSVGenerator;

  constructor() {
    this.sitemapParser = new SitemapParser();
    this.metadataExtractor = new MetadataExtractor();
    this.csvGenerator = new CSVGenerator();
  }

  async analyze(
    sitemapUrl: string,
    onProgress?: (progress: AnalysisProgress) => void
  ): Promise<PageMetadata[]> {
    const progress: AnalysisProgress = {
      totalUrls: 0,
      processedUrls: 0,
      isComplete: false,
      hasErrors: false,
      errors: []
    };

    try {
      // Step 1: Parse sitemap
      if (onProgress) {
        progress.currentUrl = 'Parsing sitemap...';
        onProgress(progress);
      }

      const sitemapUrls = await this.sitemapParser.getAllUrls(sitemapUrl);
      const urls = sitemapUrls.map(url => url.loc);
      
      progress.totalUrls = urls.length;
      
      if (onProgress) {
        progress.currentUrl = `Found ${urls.length} URLs`;
        onProgress(progress);
      }

      // Step 2: Extract metadata
      const metadata = await this.metadataExtractor.extractMetadataFromUrls(
        urls,
        (processed, total, currentUrl) => {
          progress.processedUrls = processed;
          progress.currentUrl = currentUrl || 'Processing complete';
          
          if (onProgress) {
            onProgress(progress);
          }
        }
      );

      // Count errors
      const errors = metadata.filter(m => m.error).map(m => `${m.url}: ${m.error}`);
      progress.hasErrors = errors.length > 0;
      progress.errors = errors;
      progress.isComplete = true;
      
      if (onProgress) {
        progress.currentUrl = 'Analysis complete';
        onProgress(progress);
      }

      return metadata;

    } catch (error) {
      progress.hasErrors = true;
      progress.errors.push(error instanceof Error ? error.message : 'Unknown error');
      progress.isComplete = true;
      
      if (onProgress) {
        progress.currentUrl = 'Analysis failed';
        onProgress(progress);
      }
      
      throw error;
    }
  }

  generateCSV(metadata: PageMetadata[]): string {
    return this.csvGenerator.generateCSV(metadata);
  }

  downloadCSV(metadata: PageMetadata[], filename?: string): void {
    this.csvGenerator.downloadCSV(metadata, filename);
  }
}