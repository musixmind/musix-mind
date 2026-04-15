import type { Artist } from "@/lib/types";

export const featuredArtists: Artist[] = [
  {
    name: "Nova Vale",
    genre: "Alt Pop",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    highlight: "Crystal hooks over nocturnal synths."
  },
  {
    name: "Kairo Drift",
    genre: "Electronic",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    highlight: "Club pressure, cinematic restraint."
  },
  {
    name: "Eden Vox",
    genre: "R&B",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    highlight: "Velvet vocals with future-soul textures."
  }
];

export const releases = [
  {
    title: "After Midnight Signal",
    artist: "Nova Vale",
    year: "2026",
    genre: "Alt Pop"
  },
  {
    title: "Blue Frequency",
    artist: "Kairo Drift",
    year: "2026",
    genre: "Electronic"
  },
  {
    title: "Soft Static",
    artist: "Eden Vox",
    year: "2025",
    genre: "R&B"
  }
];

export const genres = ["Pop", "Hip-Hop", "R&B", "Electronic", "Afrobeats", "Rock", "Indie", "Other"];
