import Box from "@mui/material/Box";

// Bolded, accent-colored inline highlight for a number/metric — kept inside
// its sentence (rather than pulled out to a standalone stat block) so the
// number keeps the context that explains what it means.
export default function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <Box component="span" sx={{ color: "secondary.main", fontWeight: 700 }}>
      {children}
    </Box>
  );
}
