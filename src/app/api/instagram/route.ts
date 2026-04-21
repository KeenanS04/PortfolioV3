import { NextResponse } from "next/server";

export const revalidate = 600;

const FEED_URL = "https://feeds.behold.so/9y9LdJFkEZRj4br4AQtA";

type BeholdSize = { mediaUrl: string; width: number; height: number };
type BeholdPost = {
  id: string;
  timestamp: string;
  permalink: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  isReel: boolean;
  mediaUrl: string;
  thumbnailUrl?: string;
  sizes: { small: BeholdSize; medium: BeholdSize; large: BeholdSize; full: BeholdSize };
  caption: string;
  prunedCaption: string;
  colorPalette?: { dominant?: string; vibrant?: string };
};
type BeholdFeed = {
  username: string;
  biography: string;
  profilePictureUrl: string;
  followersCount: number;
  posts: BeholdPost[];
};

export async function GET() {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 600 } });
    if (!res.ok) {
      return NextResponse.json({ error: `Behold ${res.status}` }, { status: res.status });
    }
    const feed: BeholdFeed = await res.json();

    const posts = feed.posts.slice(0, 9).map((p) => ({
      id: p.id,
      permalink: p.permalink,
      mediaType: p.mediaType,
      isReel: p.isReel,
      image: p.sizes.medium?.mediaUrl || p.sizes.small?.mediaUrl,
      width: p.sizes.medium?.width ?? 640,
      height: p.sizes.medium?.height ?? 640,
      caption: p.prunedCaption || p.caption || "",
      timestamp: p.timestamp,
      accent: p.colorPalette?.vibrant || p.colorPalette?.dominant || null,
    }));

    return NextResponse.json(
      {
        username: feed.username,
        bio: feed.biography,
        avatar: feed.profilePictureUrl,
        followers: feed.followersCount,
        posts,
        fetchedAt: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" } }
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
