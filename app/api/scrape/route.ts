import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid URL provided.' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      next: { revalidate: 3600 } // Cache for an hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, noscript, iframe, img, svg, nav, footer, header, .nav, .footer, .header, form').remove();

    // Extract text from the main body or specific likely containers
    // Some job boards use main, article, or specific classes
    let content = $('main').text() || $('article').text() || $('body').text();
    
    // Clean up whitespace
    content = content
      .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with a single space
      .trim();

    if (!content) {
      return NextResponse.json({ error: 'No content found on the page.' }, { status: 404 });
    }

    // Truncate to a reasonable length (e.g., 20k chars) to prevent massive payloads
    if (content.length > 20000) {
      content = content.substring(0, 20000) + '...';
    }

    return NextResponse.json({ text: content });

  } catch (error: any) {
    console.error('Error scraping URL:', error);
    return NextResponse.json(
      { error: 'An error occurred while attempting to scrape the URL.' },
      { status: 500 }
    );
  }
}
