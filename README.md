# danieldombrovsky.com

Personal site: a scrolling "journey" timeline of education, work, and projects, plus a chat widget and a
voice-calling demo (`/call-me-maybe`).

## Stack

- Next.js 15 (App Router) with static export (`output: 'export'`), React, Material UI + Emotion
- Tailwind is used only by the `/call-me-maybe` page
- Cloudflare Pages Functions (`my-app/functions/api/`) for the server-side pieces: the chat endpoint
  and the voice-call endpoints (OpenAI, ElevenLabs, Twilio). Usage limits use Workers KV, generated
  call audio is stored in R2.

## Layout

```
my-app/
  src/app/            pages and components (components/PageContent.tsx holds the timeline content)
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
`ELEVEN_LABS_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`.

## Deploying

Pushing to `main` deploys through Cloudflare Pages. Run `npm run build` locally first to catch type or
lint errors before pushing.
