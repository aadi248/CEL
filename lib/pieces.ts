import type { Piece } from "@/types/hunt";

export const PIECES: Piece[] = [
  {
    number: 1,
    slug: "nexus",
    theme: "NEXUS",
    headline: "ROOM WORTH BEING IN.",
    accent: "maroon",
    visual: "city coordinates / hotel plan / founder room",
    proposition:
      "NEXUS Hyderabad was held at Radisson HITEC City, intentionally limited to 100 participants, bringing startups, VCs and founders into one carefully curated room. CEL team students were fully sponsored.",
    microcopy: "Good. You found one."
  },
  {
    number: 2,
    slug: "senior-associates",
    theme: "SENIOR ASSOCIATES",
    headline: "SPONSORED OUTINGS, ON THE HOUSE.",
    accent: "green",
    visual: "movement lines / group grid / outing markers",
    proposition:
      "Recognition, team culture, sponsored outings, and a reason to be around people who make college feel less default.",
    microcopy: "Two down. You are beginning to look employable."
  },
  {
    number: 3,
    slug: "internships",
    theme: "INTERNSHIPS",
    headline: "INTERNSHIPS ACROSS STARTUPS.",
    accent: "blue",
    visual: "workspace / laptop / early team schematic",
    proposition:
      "Early-stage startups. Real ownership. Opportunities sourced through the CEL founder and investor network, open to first-years when the fit is right.",
    microcopy: "Halfway there. Do not start calling yourself a founder yet."
  },
  {
    number: 4,
    slug: "vc-pipeline",
    theme: "VC PIPELINE",
    headline: "THE VC PIPELINE.",
    accent: "red",
    visual: "rocket contour / deal flow / financial schematic",
    proposition:
      "Join CEL, learn sourcing, diligence and deal notes, meet funds, and build a credible route toward VC internship opportunities.",
    microcopy: "Four pieces. One suspicious amount of ambition."
  },
  {
    number: 5,
    slug: "culture",
    theme: "CEL CULTURE",
    headline: "THE TABLE IS SMALL FOR A REASON.",
    accent: "purple",
    visual: "team cells / collaboration map / archival crop",
    proposition:
      "A working group for students who like building, arguing clearly, shipping things, and being useful in rooms that matter.",
    microcopy: "You have almost completed a very unnecessarily elaborate campus activity."
  },
  {
    number: 6,
    slug: "legacy",
    theme: "LEGACY / NEXT GENERATION",
    headline: "BUILD THE NEXT VERSION.",
    accent: "orange",
    visual: "architecture / doorway / B-Dome coordinate frame",
    proposition:
      "BITS has a long entrepreneurship lineage. CEL Goa exists to keep that instinct alive for the next group of students walking in.",
    microcopy: "Fine. You win."
  }
];

export function getPiece(pieceNumber: number) {
  return PIECES.find((piece) => piece.number === pieceNumber);
}

export function isValidPiece(pieceNumber: number) {
  return Number.isInteger(pieceNumber) && pieceNumber >= 1 && pieceNumber <= 6;
}

export const accentHex: Record<Piece["accent"], string> = {
  maroon: "#7A1E1E",
  blue: "#0D47A1",
  green: "#2E7D32",
  red: "#E53935",
  orange: "#F4A300",
  purple: "#6A1BA9"
};
