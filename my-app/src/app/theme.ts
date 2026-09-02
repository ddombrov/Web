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
        body: {
          backgroundColor: "transparent",
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
