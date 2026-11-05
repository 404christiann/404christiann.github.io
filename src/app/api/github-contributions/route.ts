const USERNAME = "404christiann";

// Rebuilt at most once an hour; visitors get the cached copy while a fresh one is fetched.
export const revalidate = 3600;

type Day = { date: string; count: number; level: number };

function currentYear() {
  return Number(
    new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: "America/Los_Angeles" }).format(new Date()),
  );
}

function attr(tag: string, name: string) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
}

// GitHub's public calendar fragment: one <td> per day carrying its date and level,
// and a <tool-tip for="<td id>"> per day whose text holds the count.
function parseCalendar(html: string, year: number): Day[] {
  const counts = new Map<string, number>();
  for (const [, id, text] of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = text.match(/^\s*([\d,]+)\s+contributions?/);
    counts.set(id, n ? Number(n[1].replace(/,/g, "")) : 0);
  }

  const days: Day[] = [];
  for (const [tag] of html.matchAll(/<td\b[^>]*\bContributionCalendar-day\b[^>]*>/g)) {
    const date = attr(tag, "data-date");
    const id = attr(tag, "id");
    const level = Number(attr(tag, "data-level"));
    if (!date?.startsWith(`${year}-`) || !id || !(level >= 0 && level <= 4)) continue;
    days.push({ date, count: counts.get(id) ?? 0, level });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

export async function GET() {
  const year = currentYear();
  try {
    const res = await fetch(
      `https://github.com/users/${USERNAME}/contributions?from=${year}-01-01&to=${year}-12-31`,
      { headers: { "User-Agent": "404christian.com contributions chart" } },
    );
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
    const days = parseCalendar(await res.text(), year);
    if (days.length < 365) throw new Error(`Parsed only ${days.length} days`);
    const total = days.reduce((sum, d) => sum + d.count, 0);
    return Response.json({ username: USERNAME, year, total, updatedAt: new Date().toISOString(), days });
  } catch (error) {
    // The homepage keeps its built-in snapshot when this fails.
    return Response.json({ error: String(error) }, { status: 502 });
  }
}
