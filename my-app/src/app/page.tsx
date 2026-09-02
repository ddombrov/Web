import Box from "@mui/material/Box";
import Hero from "./components/Hero";
import PageContent from "./components/PageContent";
import ContourTexture from "./components/ContourTexture";

export default function Home() {
  return (
    <>
      <Hero />
      <Box sx={{ position: "relative" }}>
        <ContourTexture />
        <PageContent />
      </Box>
    </>
  );
}
