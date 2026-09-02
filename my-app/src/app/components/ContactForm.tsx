"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { textShadow } from "./styles";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeaqgkgd";

const fieldSx = {
  "& .MuiInputBase-root": { color: "#fff" },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "secondary.main" },
};

type Status = "idle" | "submitting" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        setStatus("sent");
        formRef.current?.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <Box component="form" ref={formRef} onSubmit={handleSubmit} sx={{ textAlign: "left", maxWidth: 480, mx: "auto" }}>
      <Stack spacing={2}>
        {status === "sent" && (
          <Typography variant="body1" sx={{ color: "#EDEFF3", textShadow }}>
            Thanks for reaching out — I&apos;ll get back to you soon.
          </Typography>
        )}
        <TextField label="Name" name="name" required fullWidth sx={fieldSx} />
        <TextField label="Email" name="email" type="email" required fullWidth sx={fieldSx} />
        <TextField label="Message" name="message" required fullWidth multiline rows={4} sx={fieldSx} />
        {status === "error" && (
          <Typography variant="body2" sx={{ color: "#E8968C", textShadow }}>
            Something went wrong sending that — please try again, or email me directly.
          </Typography>
        )}
        <Button type="submit" variant="contained" color="secondary" size="large" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send Message"}
        </Button>
      </Stack>
    </Box>
  );
}
