"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { textShadow } from "./styles";
import type { Course } from "./courseData";

function CourseRow({ course }: { course: Course }) {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <Box
        component="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        sx={{
          all: "unset",
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          gap: 0.75,
          width: "100%",
          py: 0.85,
          "&:hover": { "& .course-name": { color: "#fff" } },
        }}
      >
        <KeyboardArrowRightIcon
          sx={{
            fontSize: 16,
            mt: "3px",
            flexShrink: 0,
            color: "rgba(255,255,255,0.45)",
            transition: "transform 0.2s ease",
            transform: open ? "rotate(90deg)" : "none",
          }}
        />
        <Typography variant="body2" className="course-name" sx={{ color: "rgba(255,255,255,0.85)", textShadow, transition: "color 0.2s ease" }}>
          <Box component="span" sx={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: "0.8em", mr: 1 }}>
            {course.code}
          </Box>
          {course.name}
        </Typography>
      </Box>
      {open && (
        <Typography variant="caption" sx={{ display: "block", color: "rgba(255,255,255,0.6)", textShadow, pb: 1.25, pl: 3.25 }}>
          {course.description}
        </Typography>
      )}
    </Box>
  );
}

// Just the course rows for one term — each collapsed to name + code with
// the official calendar description a click away. Meant to be dropped
// straight into a timeline entry for that term.
export default function CourseList({ courses }: { courses: Course[] }) {
  return (
    <Box sx={{ mt: 1 }}>
      {courses.map((c) => (
        <CourseRow key={c.code} course={c} />
      ))}
    </Box>
  );
}
