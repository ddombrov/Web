import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1B2A41",
    },
    secondary: {
      main: "#D98E33",
    },
    background: {
      default: "#F7F7F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1C1C1C",
      secondary: "#4A4A4A",
    },
  },
  typography: {
    fontFamily: "var(--font-inter), Arial, Helvetica, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          // Reveal slides timeline entries in with a translateX before they
          // scroll into view; that transform paints outside the element's
          // normal box, which can widen the page's scrollable area even
          // though the shifted content itself is never visible. Clipping
          // horizontally here contains it without affecting vertical scroll.
          overflowX: "hidden",
        },
        body: {
          backgroundColor: "transparent",
          overflowX: "hidden",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1B2A41",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
