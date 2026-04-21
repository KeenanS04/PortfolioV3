import { NextResponse } from "next/server";

export const revalidate = 300;

const USER = "KeenanS04";

type Repo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

export async function GET() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github.mercy-preview+json",
          "User-Agent": "keenan-portfolio",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub ${res.status}` },
        { status: res.status }
      );
    }

    const repos: Repo[] = await res.json();

    const filtered = repos
      .filter((r) => !r.fork && !r.archived && (r.topics ?? []).includes("project"))
      .sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at))
      .slice(0, 9)
      .map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        url: r.html_url,
        homepage: r.homepage,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        topics: r.topics ?? [],
        updated: r.pushed_at,
      }));

    return NextResponse.json(
      { repos: filtered, fetchedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
