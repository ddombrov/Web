"use client";

import Image from "next/image";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import useFloatingEffect from "./useFloatingEffect";

// Merges the original hackathon app's two separate desktop/mobile card
// components into one that wraps naturally via flexbox instead, and uses
// plain flex layout instead of MUI Grid (the original targeted MUI v5's
// Grid API, which changed incompatibly in the v7 already used elsewhere on
// this site).
export default function VoiceCard({
  name,
  description,
  img,
  sample,
}: {
  name: string;
  description: string;
  img: string;
  sample: string;
}) {
  const floatingStyle = useFloatingEffect();

  return (
    <div style={floatingStyle}>
      <div
        style={{
          width: 300,
          height: 250,
          backgroundColor: "rgba(246, 246, 246, 0.4)",
          borderRadius: 8,
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.10)",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 8, flex: 1, minHeight: 0 }}>
          <div style={{ position: "relative", width: "50%" }}>
            <Image src={img} fill alt={`Picture representing ${name}`} style={{ objectFit: "contain" }} draggable={false} />
          </div>
          <div style={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="body1" sx={{ textAlign: "center", mb: 1, fontWeight: 600 }}>
              {name}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center", fontSize: 14 }}>
              {description}
            </Typography>
          </div>
        </div>
        <Button
          fullWidth
          sx={{ border: "1px solid rgb(57, 100, 239)" }}
          onClick={() => {
            const audio = new Audio(sample);
            audio.play();
          }}
        >
          <div className="flex flex-row items-center">
            <PlayCircleOutlineIcon sx={{ mr: 1 }} />
            {`Play ${name}'s voice`}
          </div>
        </Button>
      </div>
    </div>
  );
}
