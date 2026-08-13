"use client";

export function PrintButton() {
  return (
    <button className="button maroon" onClick={() => window.print()} type="button">
      PRINT CONTACT SHEET
    </button>
  );
}
