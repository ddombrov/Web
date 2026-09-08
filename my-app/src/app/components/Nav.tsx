"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  { kind: "scroll", id: "experience", label: "My Journey" },
  { kind: "filter", filter: "skills", label: "Skills" },
  { kind: "filter", filter: "experience", label: "Experience" },
  { kind: "filter", filter: "projects", label: "Projects" },
  { kind: "scroll", id: "contact", label: "Contact" },
];

const scrollIds = navItems.filter((i): i is Extract<NavItem, { kind: "scroll" }> => i.kind === "scroll").map((i) => i.id);

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
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
    setDrawerOpen(false);

    // home/about/experience/contact only exist as DOM elements on the home
    // page itself. From any other route (e.g. /call-me-maybe), there's
    // nothing to scroll to yet — navigate home first, then poll briefly for
    // the target to mount, since a client-side route change isn't instant.
    if (pathname !== "/") {
      router.push("/");
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (attempts++ < 40) {
          setTimeout(tryScroll, 50);
        }
      };
      setTimeout(tryScroll, 50);
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClick = (item: NavItem) => {
    if (item.kind === "scroll") {
      // Home, About Me, My Journey, and Contact are real places on the
      // page — navigating to any of them always closes whatever filter
      // gallery is open, the same way the overlay's own close button does.
      // While a filter is active, every matching entry's normal timeline
      // slot is collapsed to an empty placeholder (its card is portaled
      // into the gallery instead), so the page is much shorter than its
      // real height until that clears. Scrolling in the very same tick as
      // setFilter(null) would target that stale, too-short document —
      // waiting two frames lets React's re-render (and the layout snap
      // back to full height) land first, so the scroll target is correct.
      setFilter(null);
      requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(item.id)));
    } else {
      // Skills, Experience, and Projects aren't places of their own — they
      // open a filtered view of the Journey in front of wherever you are.
      setFilter(item.filter);
      scrollTo("experience");
    }
  };

  const isActive = (item: NavItem) => (item.kind === "scroll" ? activeId === item.id && !filter : filter === item.filter);

  // The transparent, blend-with-the-photo-behind-it look only makes sense
  // on the home page, which always has a dark hero image at the top. Any
  // other route (e.g. /call-me-maybe, which has its own light background)
  // has no guarantee of a dark backdrop, so the nav stays opaque there.
  const opaque = scrolled || pathname !== "/";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: opaque ? `${skyColor}D9` : "transparent",
        backdropFilter: opaque ? "blur(10px)" : "none",
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
