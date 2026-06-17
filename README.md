# World Cup 2026 Dashboard

A live dashboard for following the FIFA World Cup 2026. Built with Nuxt 3 + Tailwind CSS, powered by football-data.org.

## Features

- **Live** — in-progress matches with real-time scores and animated badge
- **Today** — today's schedule with live matches integrated at the top
- **Upcoming** — next fixtures grouped by date
- **Results** — final scores for completed matches
- **Standings** — full group stage tables
- **Bracket** — knockout rounds (round of 16, quarters, semis, final)
- Auto-refresh every 60 seconds
- Match times displayed in the user's local timezone
- National flags for all teams
- Dark mode, mobile responsive

## Tech Stack

- [Nuxt 3](https://nuxt.com) — Vue framework with SSR
- [Tailwind CSS](https://tailwindcss.com) — styling
- [flag-icons](https://github.com/lipis/flag-icons) — SVG national flags
- [football-data.org](https://www.football-data.org) — match data API

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. API key

Create a free account at [football-data.org](https://www.football-data.org/client/register) and copy your API key.

Create a `.env` file in the project root:

```env
FOOTBALL_API_KEY=your_api_key_here
```

### 3. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Import the repository in [Vercel](https://vercel.com)
2. Add the `FOOTBALL_API_KEY` environment variable in the project settings
3. Deploy — Vercel auto-detects Nuxt 3

## Project Structure

```
├── components/
│   ├── TodayMatches.vue      # Today's matches + live scores integrated
│   ├── UpcomingMatches.vue   # Upcoming fixtures
│   ├── PastResults.vue       # Past results
│   ├── GroupStandings.vue    # Group stage standings
│   └── KnockoutBracket.vue   # Knockout bracket
├── composables/
│   └── useFootball.ts        # API fetch + data filtering
├── server/api/
│   ├── matches.get.ts        # Proxy → football-data.org/matches
│   └── standings.get.ts      # Proxy → football-data.org/standings
└── utils/
    └── flagCodes.ts          # TLA → ISO 3166-1 alpha-2 mapping
```
