import { NextRequest, NextResponse } from 'next/server';
import { SitemapAnalyzer } from '@/lib/sitemapAnalyzer';

export async function POST(request: NextRequest) {
  try {
    const { sitemapUrl } = await request.json();
    
    if (!sitemapUrl) {
      return NextResponse.json(
        { error: 'Sitemap URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(sitemapUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const analyzer = new SitemapAnalyzer();
    const results = await analyzer.analyze(sitemapUrl);
    
    return NextResponse.json({
      success: true,
      data: results,
      totalUrls: results.length,
      errors: results.filter(r => r.error).length
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false 
      },
      { status: 500 }
    );
  }
}