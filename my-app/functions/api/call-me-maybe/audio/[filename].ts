/// <reference types="@cloudflare/workers-types" />

// Serves a generated call's mp3 back out of R2 - this is the URL Twilio's
// <Play> verb fetches. Needs the same CALL_AUDIO R2 bucket binding as
// start-call.ts.
interface Env {
  CALL_AUDIO: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const filename = params.filename;
  if (typeof filename !== "string" || !/^[a-f0-9-]+\.mp3$/i.test(filename)) {
    return new Response("Not found", { status: 404 });
  }

  const object = await env.CALL_AUDIO.get(filename);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
