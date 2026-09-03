import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { textShadow } from "./styles";
import type { Course } from "./courseData";

function CourseRow({ course, expanded }: { course: Course; expanded: boolean }) {
  return (
    <Box sx={{ borderBottom: "1px solid rgba(255,255,255,0.07)", py: 0.85 }}>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", textShadow }}>
        {expanded && (
          <Box component="span" sx={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: "0.8em", mr: 1 }}>
            {course.code}
          </Box>
        )}
        {course.name}
      </Typography>
      {expanded && (
        <Typography variant="caption" sx={{ display: "block", color: "rgba(255,255,255,0.6)", textShadow, pt: 0.5 }}>
          {course.description}
        </Typography>
      )}
    </Box>
  );
}

// Just the course rows for one term — only the name shows by default; the
// code and the official calendar description reveal together when
// `expanded` (driven by clicking the term's card, not per-row).
export default function CourseList({ courses, expanded = false }: { courses: Course[]; expanded?: boolean }) {
  return (
    <Box sx={{ mt: 1 }}>
      {courses.map((c) => (
        <CourseRow key={c.code} course={c} expanded={expanded} />
      ))}
    </Box>
  );
}
