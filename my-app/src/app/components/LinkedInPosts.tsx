import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { textShadow, dropShadow } from "./styles";

// LinkedIn has no public API for pulling a personal profile's post feed —
// that's gated behind their Marketing/Partner API program. The only real
// embed mechanism is per-post: open a post on LinkedIn, "..." menu ->
// "Embed this post", copy the src URL it gives you, and add it below.
// Empty until real embed URLs are added — no fabricated placeholder posts.
const posts: { src: string; title: string }[] = [];

export default function LinkedInPosts() {
  if (posts.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h6" sx={{ color: "#fff", textShadow, mb: 1 }}>
          From LinkedIn
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", textShadow, mb: 2 }}>
          Recent posts coming soon — in the meantime, here&apos;s my profile.
        </Typography>
        <Button
          component="a"
          href="https://www.linkedin.com/in/ddombrov/"
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}
        >
          View my LinkedIn
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ color: "#fff", textShadow, mb: 2, textAlign: "center" }}>
        From LinkedIn
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
        {posts.map((p) => (
          <Box key={p.src} sx={{ filter: dropShadow, borderRadius: 2, overflow: "hidden" }}>
            <iframe
              src={p.src}
              title={p.title}
              height={399}
              width={504}
              style={{ border: 0, maxWidth: "100%" }}
              allowFullScreen
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
