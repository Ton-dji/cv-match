import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid URL provided.' }, { status: 400 });
    }

    // Use Jina Reader API to bypass bot protection and extract clean text/markdown
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        'Accept': 'text/plain',
      },
      next: { revalidate: 3600 } // Cache for an hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}. Job boards like LinkedIn often block automated scrapers. Please try copying and pasting the text instead.` },
        { status: response.status }
      );
    }

    let content = await response.text();

    if (!content) {
      return NextResponse.json({ error: 'No content found on the page.' }, { status: 404 });
    }

    // Detect Cloudflare or similar bot-protection pages
    const isBlocked = 
      content.includes("Just a moment...") || 
      content.includes("Additional Verification Required") || 
      content.includes("Cloudflare Errors") ||
      content.includes("Attention Required!");

    if (isBlocked) {
      return NextResponse.json({ 
        error: 'Job boards like Indeed/LinkedIn actively block automated access. Please copy and paste the job description text manually.' 
      }, { status: 403 });
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
