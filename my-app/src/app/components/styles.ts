// Shared visual constants sampled from mountain3.jpg: sky blue for the header,
// shadowed dirt/scrub brown for everything below the hero.
export const skyColor = "#7498C7";
export const dirtColor = "#332D14";

export const textShadow = "0 2px 10px rgba(0,0,0,0.6)";
export const dropShadow = "drop-shadow(0 6px 18px rgba(0,0,0,0.55))";

export const chipSx = {
  color: "#fff",
  borderColor: "rgba(255,255,255,0.4)",
  textShadow,
  "& .MuiChip-icon": { color: "#fff" },
};

// Applied to the Box wrapping any real photo (not logos/icons): a gentle
// zoom on the image itself when hovered, so photos feel interactive even
// though the cards around them no longer are.
export const photoFrameSx = {
  borderRadius: 2,
  overflow: "hidden",
  filter: dropShadow,
  display: "inline-block",
  "& img": { transition: "transform 0.45s ease" },
  "&:hover img": { transform: "scale(1.07)" },
};
