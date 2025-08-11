import React from "react";

/**
 * MatchInfoSection
 *
 * Displays home/away team names (and their logos if provided) along with the score,
 * in a strictly horizontal, minimalist layout matching the full width and height of the main player.
 * Score is plain text (no box/border/background), matching the new requirements.
 * Layout: [Logo][Team name]    [SCORE]   [Team name][Logo] -- all aligned center.
 */

// PUBLIC_INTERFACE
const MatchInfoSection = ({ match }) => {
  // Defensive fallback if props are not provided
  const homeTeam = match?.homeTeam || "Home";
  const awayTeam = match?.awayTeam || "Away";
  const homeLogo = match?.homeLogo || "";
  const awayLogo = match?.awayLogo || "";
  // The task says to display 0:0
  const homeScore = 0;
  const awayScore = 0;

  // Inline styles and layout tokens for VideoPlayer width/height matching
  return (
    <section
      aria-label={`Match info: ${homeTeam} vs ${awayTeam} — Score ${homeScore} to ${awayScore}`}
      // Use full width, no maxWidth constraint, match aspect ratio (keep it flat in height, stretch in width)
      className="w-full flex items-center justify-center mx-auto mt-6 mb-8 px-0"
      style={{
        minHeight: 56,
        height: 68,
        maxHeight: 100, // 80-100px per design notes
        width: "100%",
        background: "var(--primary-bg, #0a0e27)",
        borderRadius: "8px",
        padding: "0 16px",
        fontFamily: "var(--font-primary), Inter, sans-serif",
        border: "none",
        boxShadow: "none"
      }}
    >
      {/* Home Team */}
      <div
        className="matchinfo-team flex items-center flex-1 min-w-0"
        style={{
          justifyContent: "flex-end",
        }}
      >
        {/* Logo or Letter */}
        {homeLogo ? (
          <img
            src={homeLogo}
            alt={homeTeam}
            className="team-logo"
            style={{
              width: 40,
              height: 40,
              minWidth: 40,
              minHeight: 40,
              borderRadius: "50%",
              objectFit: "cover",
              background: "#222",
              marginRight: 12,
              border: "2px solid #222",
              boxShadow: "0 1px 3px #13131d33"
            }}
          />
        ) : (
          <div
            className="team-logo flex items-center justify-center"
            aria-label={`${homeTeam} logo`}
            style={{
              width: 40,
              height: 40,
              minWidth: 40,
              minHeight: 40,
              borderRadius: "50%",
              background: "#222",
              marginRight: 12,
              border: "2px solid #333",
              color: "#fff7",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1,
              textAlign: "center",
              boxShadow: "0 1px 3px #13131d33"
            }}
          >
            {homeTeam[0] ? homeTeam[0].toUpperCase() : "H"}
          </div>
        )}
        <span
          className="team-name"
          style={{
            color: "var(--text-secondary, #b8c5d6)",
            fontFamily: "var(--font-primary), Inter, sans-serif",
            fontSize: 15,
            fontWeight: 500,
            textTransform: "capitalize",
            letterSpacing: "0.4px",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            textAlign: "right",
            maxWidth: 108
          }}
        >
          {homeTeam}
        </span>
      </div>

      {/* Score Section - just text, no box, border, or background */}
      <div
        className="score-section flex items-center justify-center mx-7"
        style={{
          margin: "0 32px",
          minWidth: 72,
          fontFamily: "var(--font-mono), JetBrains Mono, monospace",
        }}
      >
        <span
          className="score-text select-none"
          aria-label={`Score: ${homeScore} to ${awayScore}`}
          style={{
            color: "var(--text-primary, #fff)",
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "2.5px",
            textShadow: "0 1px 6px #0007",
            background: "none",
            border: "none",
            borderRadius: "0",
            padding: 0,
            margin: 0
          }}
        >
          {homeScore}:{awayScore}
        </span>
      </div>

      {/* Away Team */}
      <div
        className="matchinfo-team flex items-center flex-1 min-w-0"
        style={{
          justifyContent: "flex-start",
        }}
      >
        <span
          className="team-name"
          style={{
            color: "var(--text-secondary, #b8c5d6)",
            fontFamily: "var(--font-primary), Inter, sans-serif",
            fontSize: 15,
            fontWeight: 500,
            textTransform: "capitalize",
            letterSpacing: "0.4px",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            textAlign: "left",
            maxWidth: 108,
            marginRight: 12
          }}
        >
          {awayTeam}
        </span>
        {awayLogo ? (
          <img
            src={awayLogo}
            alt={awayTeam}
            className="team-logo"
            style={{
              width: 40,
              height: 40,
              minWidth: 40,
              minHeight: 40,
              borderRadius: "50%",
              objectFit: "cover",
              background: "#222",
              marginLeft: 0,
              border: "2px solid #222",
              boxShadow: "0 1px 3px #13131d33"
            }}
          />
        ) : (
          <div
            className="team-logo flex items-center justify-center"
            aria-label={`${awayTeam} logo`}
            style={{
              width: 40,
              height: 40,
              minWidth: 40,
              minHeight: 40,
              borderRadius: "50%",
              background: "#222",
              marginLeft: 0,
              border: "2px solid #333",
              color: "#fff7",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1,
              textAlign: "center",
              boxShadow: "0 1px 3px #13131d33"
            }}
          >
            {awayTeam[0] ? awayTeam[0].toUpperCase() : "A"}
          </div>
        )}
      </div>
    </section>
  );
};

export default MatchInfoSection;
