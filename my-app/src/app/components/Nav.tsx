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
import { useJourneyFilter, type JourneyFilter } from "./JourneyFilterContext";

// Skills and Projects don't have their own sections anymore — everything
// lives on the Journey timeline. Clicking them filters the timeline down
// to matching entries instead of scrolling to a dedicated block; clicking
// "My Journey" itself clears any active filter.
type NavItem =
  | { kind: "scroll"; id: string; label: string }
  | { kind: "filter"; filter: JourneyFilter; label: string };

const navItems: NavItem[] = [
  { kind: "scroll", id: "home", label: "Home" },
  { kind: "scroll", id: "about", label: "About Me" },
  { kind: "filter", filter: "skills", label: "Skills" },
  { kind: "scroll", id: "experience", label: "My Journey" },
  { kind: "filter", filter: "projects", label: "Projects" },
  { kind: "scroll", id: "contact", label: "Contact" },
];

const scrollIds = navItems.filter((i): i is Extract<NavItem, { kind: "scroll" }> => i.kind === "scroll").map((i) => i.id);

export default function Nav() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const { filter, setFilter } = useJourneyFilter();

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
    scrollIds.forEach((id) => {
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

  const handleClick = (item: NavItem) => {
    if (item.kind === "scroll") {
      if (item.id === "experience") setFilter(null);
      scrollTo(item.id);
    } else {
      setFilter(item.filter);
      scrollTo("experience");
    }
  };

  const isActive = (item: NavItem) => (item.kind === "scroll" ? activeId === item.id && !filter : filter === item.filter);

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
          onClick={() => handleClick({ kind: "scroll", id: "home", label: "Home" })}
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
                {navItems.map((item) => (
                  <ListItemButton key={item.label} selected={isActive(item)} onClick={() => handleClick(item)}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
              </List>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => handleClick(item)}
                sx={{
                  fontWeight: isActive(item) ? 700 : 400,
                  opacity: isActive(item) ? 1 : 0.75,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
