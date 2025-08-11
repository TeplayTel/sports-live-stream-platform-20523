import React from "react";

// PUBLIC_INTERFACE
/**
 * MatchInfoSection
 * Simplified score-only display for placement beneath the video player.
 * Shows only the score "0:0" as required; all other details are removed.
 */
const MatchInfoSection = () => {
  return (
    <section
      aria-label="Current score 0 to 0"
      className="match-info-section mx-auto mt-7 mb-8 w-full max-w-xs rounded-xl flex items-center justify-center shadow-xl bg-[rgba(23,20,34,0.94)]"
      style={{
        border: "1.5px solid #fff1",
        boxShadow: "0 4px 28px #0009, 0 1.5px 8px #2228",
        backdropFilter: "blur(14px)",
        minHeight: 74,
        minWidth: 120,
        maxWidth: 180,
        fontFamily: "var(--font-mono), monospace",
        padding: "18px 0"
      }}
    >
      <span
        className="score-text"
        style={{
          color: "var(--text-primary)",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 38,
          fontWeight: 800,
          letterSpacing: 3,
          textShadow: "0 2px 12px #0006"
        }}
      >
        0:0
      </span>
    </section>
  );
};

export default MatchInfoSection;
