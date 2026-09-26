# danieldombrovsky.com

Personal site: a scrolling "journey" timeline of education, work, and projects, plus a chat widget, a
voice-calling demo (`/call-me-maybe`), and a trip itinerary planner (`/trip-planner`).

## Stack

- Next.js 15 (App Router) with static export (`output: 'export'`), React, Material UI + Emotion
- Tailwind is used only by the `/call-me-maybe` page
- Cloudflare Pages Functions (`my-app/functions/api/`) for the server-side pieces: the chat endpoint
  the voice-call endpoints (OpenAI, ElevenLabs, Twilio), and the trip planner's endpoints
  (`functions/api/trip-planner/`: Google Places, Geocoding and Routes, Gemini, OpenAI, Reddit, Ticketmaster).
  Usage limits use Workers KV, generated call audio is stored in R2.

## Layout

```
my-app/
  src/app/            pages and components (components/PageContent.tsx holds the timeline content)
  src/trip-planner/   the trip planner's components and libraries (used by app/trip-planner and its functions)
  functions/api/      Cloudflare Pages Functions
  public/             images, logos, voice samples
```

## Local development

Requires Node 20 (see `my-app/.nvmrc`).

```bash
cd my-app
npm install
npm run dev        # site only, http://localhost:3000
npm run dev:cf     # in a second terminal: Pages Functions on :8788, proxying the dev server
```

Secrets for the functions go in `my-app/.dev.vars` (gitignored): `OPENAI_API_KEY`,
`ELEVEN_LABS_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`. The trip planner
adds `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `GOOGLE_PLACES_API_KEY`, `GEMINI_API_KEY`, `REDDIT_CLIENT_ID`,
`REDDIT_CLIENT_SECRET`, and `TICKETMASTER_API_KEY` (Reddit and Ticketmaster are optional). The same names must
be set as environment variables on the Cloudflare Pages project. The Maps key is served to the browser at runtime
by `/api/trip-planner/config` and must be restricted to the site's domains in Google Cloud.

## Deploying

Pushing to `main` deploys through Cloudflare Pages. Run `npm run build` locally first to catch type or
lint errors before pushing.
