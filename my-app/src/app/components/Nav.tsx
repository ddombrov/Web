"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { skyColor } from "./styles";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setDrawerOpen(false);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: scrolled ? `${skyColor}D9` : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        boxShadow: "none",
        transition: "background-color 0.3s ease",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box
          onClick={() => scrollTo("home")}
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <Image src="/logo.jpg" alt="Logo" width={40} height={40} style={{ borderRadius: 4 }} />
        </Box>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu">
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <List sx={{ width: 220 }}>
                {sections.map(({ id, label }) => (
                  <ListItemButton key={id} selected={activeId === id} onClick={() => scrollTo(id)}>
                    <ListItemText primary={label} />
                  </ListItemButton>
                ))}
              </List>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            {sections.map(({ id, label }) => (
              <Button
                key={id}
                color="inherit"
                onClick={() => scrollTo(id)}
                sx={{
                  fontWeight: activeId === id ? 700 : 400,
                  opacity: activeId === id ? 1 : 0.75,
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
