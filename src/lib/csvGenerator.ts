import { PageMetadata } from '@/types';

export class CSVGenerator {
  private escapeCSVValue(value: string | undefined): string {
    if (!value) return '';
    
    // If the value contains comma, newline, or quote, wrap it in quotes
    if (value.includes(',') || value.includes('\n') || value.includes('"')) {
      // Escape quotes by doubling them
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    }
    
    return value;
  }

  generateCSV(metadata: PageMetadata[]): string {
    const headers = [
      'URL',
      'Title',
      'Meta Description',
      'Meta Keywords', 
      'OG Title',
      'OG Description',
      'OG Image',
      'OG URL',
      'OG Type',
      'OG Site Name',
      'Twitter Card',
      'Twitter Site',
      'Twitter Creator',
      'Twitter Title',
      'Twitter Description',
      'Twitter Image',
      'Robots',
      'Canonical',
      'Author',
      'Error'
    ];

    const csvLines = [headers.join(',')];

    for (const item of metadata) {
      const row = [
        this.escapeCSVValue(item.url),
        this.escapeCSVValue(item.title),
        this.escapeCSVValue(item.metaDescription),
        this.escapeCSVValue(item.metaKeywords),
        this.escapeCSVValue(item.ogTitle),
        this.escapeCSVValue(item.ogDescription),
        this.escapeCSVValue(item.ogImage),
        this.escapeCSVValue(item.ogUrl),
        this.escapeCSVValue(item.ogType),
        this.escapeCSVValue(item.ogSiteName),
        this.escapeCSVValue(item.twitterCard),
        this.escapeCSVValue(item.twitterSite),
        this.escapeCSVValue(item.twitterCreator),
        this.escapeCSVValue(item.twitterTitle),
        this.escapeCSVValue(item.twitterDescription),
        this.escapeCSVValue(item.twitterImage),
        this.escapeCSVValue(item.robots),
        this.escapeCSVValue(item.canonical),
        this.escapeCSVValue(item.author),
        this.escapeCSVValue(item.error)
      ];

      csvLines.push(row.join(','));
    }

    return csvLines.join('\n');
  }

  downloadCSV(metadata: PageMetadata[], filename: string = 'sitemap-analysis.csv'): void {
    const csvContent = this.generateCSV(metadata);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}