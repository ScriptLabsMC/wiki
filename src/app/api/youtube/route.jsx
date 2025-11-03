import {
  NextResponse
} from 'next/server';

export async function GET() {
  const CHANNEL_ID = "UCMt0Eda74CZwDUBm6HpWGUA";
  const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

  try {
    console.log('🎬 Fetching YouTube videos from RSS...');

    const response = await fetch(FEED_URL);

    if (!response.ok) {
      throw new Error(`YouTube RSS error: ${response.status}`);
    }

    const xml = await response.text();
    const videos = parseYouTubeRSS(xml);

    console.log(`✅ Found ${videos.length} videos`);
    return NextResponse.json(videos);

  } catch (error) {
    console.error('❌ YouTube API Error:', error.message);
    return NextResponse.json(
      {
        error: error.message
      },
      {
        status: 500
      }
    );
  }
}

// Función para parsear el RSS de YouTube
function parseYouTubeRSS(xml) {
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  const entries = [];
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];

    const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
    const publishedMatch = entry.match(/<published>([\s\S]*?)<\/published>/);
    const thumbMatch = entry.match(/<media:thumbnail url="([\s\S]*?)"/);
    const videoIdMatch = entry.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/);

    const title = titleMatch ? titleMatch[1]: "";
    const videoId = videoIdMatch ? videoIdMatch[1]: "";
    const link = videoId ? `https://www.youtube.com/watch?v=${videoId}`: "";
    const published = publishedMatch ? publishedMatch[1].split("T")[0]: "";
    const thumbnail = thumbMatch ? thumbMatch[1]: "";

    // Determinar nivel según el título
    const titleLower = title.toLowerCase();
    let level = "no-category";

    if (titleLower.includes("beginner") || titleLower.includes("principiante") || titleLower.includes("básico") || titleLower.includes("novato")) {
      level = "beginner";
    } else if (titleLower.includes("intermedio") || titleLower.includes("intermediate") || titleLower.includes("medium")) {
      level = "intermediate";
    } else if (titleLower.includes("avanzado") || titleLower.includes("advanced") || titleLower.includes("expert")) {
      level = "advanced";
    }

    entries.push({
      title,
      link,
      published,
      thumbnail,
      level,
      videoId
    });
  }

  return entries;
}