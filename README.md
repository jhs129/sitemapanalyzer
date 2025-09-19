# Sitemap Analyzer

A Next.js web application that analyzes sitemaps and generates detailed CSV reports with page metadata.

## Features

- **Sitemap Parsing**: Supports both regular sitemaps and sitemap index files
- **Recursive Processing**: Automatically processes nested sitemaps referenced in sitemap index files
- **Comprehensive Metadata Extraction**: Extracts page titles, meta descriptions, keywords, Open Graph tags, Twitter Card data, and more
- **CSV Export**: Generates downloadable CSV reports with all collected metadata
- **Progress Tracking**: Real-time progress updates during analysis
- **Error Handling**: Graceful error handling with detailed error reporting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jhs129/sitemapanalyzer.git
cd sitemapanalyzer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Enter the URL of a sitemap (e.g., `https://example.com/sitemap.xml`)
2. Click "Analyze Sitemap"
3. Wait for the analysis to complete
4. Download the generated CSV report

## Supported Metadata

The tool extracts the following metadata from each page:

### Basic Meta Tags
- Page Title
- Meta Description
- Meta Keywords
- Robots directive
- Canonical URL
- Author

### Open Graph Tags
- og:title
- og:description
- og:image
- og:url
- og:type
- og:site_name

### Twitter Card Tags
- twitter:card
- twitter:site
- twitter:creator
- twitter:title
- twitter:description
- twitter:image

## Technical Details

### Architecture

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Sitemap Parsing**: Custom XML parser using xml2js
- **HTML Parsing**: Cheerio for server-side HTML parsing
- **CSV Generation**: Custom CSV generator with proper escaping

### Key Components

- `SitemapParser`: Handles XML sitemap parsing and recursive processing
- `MetadataExtractor`: Fetches and parses HTML pages to extract metadata
- `CSVGenerator`: Generates properly formatted CSV files
- `SitemapAnalyzer`: Main orchestrator class that coordinates all operations

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
