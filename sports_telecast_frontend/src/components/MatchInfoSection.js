import React from "react";

/**
 * MatchInfoSection
 *
 * Displays home/away team names (and their logos if provided) along with the score, in a compact, modern horizontal layout.
 * - Team name and logo left, score center, team name and logo right (mirrored)
 * - Accepts prop: match { homeTeam, awayTeam, homeLogo, awayLogo, homeScore, awayScore }, but falls back to "Home"/"Away", 0:0 if not supplied
 */

// PUBLIC_INTERFACE
const MatchInfoSection = ({ match }) => {
  // Defensive fallback if props are not provided
  const homeTeam = match?.homeTeam || "Home";
  const awayTeam = match?.awayTeam || "Away";
  const homeLogo = match?.homeLogo || "";
  const awayLogo = match?.awayLogo || "";
  // The task says to display 0:0
  const homeScore = 0; // match?.homeScore ?? 0
  const awayScore = 0; // match?.awayScore ?? 0

  return (
    <section
      aria-label={`Match info: ${homeTeam} vs ${awayTeam} — Score ${homeScore} to ${awayScore}`}
      className="mx-auto mt-7 mb-8 w-full max-w-md min-w-[220px] rounded-xl flex items-center justify-center shadow-xl bg-[rgba(23,20,34,0.94)]"
      style={{
        border: "1.5px solid #fff1",
        boxShadow: "0 4px 28px #0009, 0 1.5px 8px #2228",
        backdropFilter: "blur(14px)",
        minHeight: 80,
        minWidth: 180,
        maxWidth: 380,
        fontFamily: "var(--font-primary), Inter, sans-serif",
        padding: "14px 18px",
        gap: 0,
      }}
    >
      {/* Home team */}
      <div className="team-section flex flex-col items-center min-w-[74px] max-w-[120px] flex-1">
        {homeLogo ? (
          <img
            src={homeLogo}
            alt={homeTeam}
            className="team-logo"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 7,
              background: "#222",
              border: "2.5px solid #fff3",
              boxShadow: "0 2px 10px #13131d44",
            }}
          />
        ) : (
          <div
            className="team-logo flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#222",
              marginBottom: 7,
              border: "2.5px solid #fff1",
              color: "#fff7",
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: 1,
              textAlign: "center",
              boxShadow: "0 2px 10px #13131d44",
            }}
            aria-label={`${homeTeam} logo`}
          >
            {homeTeam[0] ? homeTeam[0].toUpperCase() : "H"}
          </div>
        )}
        <span
          className="team-name"
          style={{
            color: "var(--text-secondary,#e0e0e0)",
            fontFamily: "var(--font-primary), Inter, sans-serif",
            fontSize: 14,
            fontWeight: 400,
            textTransform: "capitalize",
            letterSpacing: "0.3px",
            textAlign: "center"
          }}
        >
          {homeTeam}
        </span>
      </div>
      {/* Score Section */}
      <div
        className="score-section flex items-center justify-center mx-7 px-5 py-2 rounded-md"
        style={{
          background: "#18151e",
          borderRadius: 6,
          border: "1.5px solid #333b",
          boxShadow: "0 1.5px 8px #111b",
          margin: "0 24px",
          minWidth: 68,
          fontFamily: "var(--font-mono), JetBrains Mono, monospace",
        }}
      >
        <span
          className="score-text select-none"
          aria-label={`Score: ${homeScore} to ${awayScore}`}
          style={{
            color: "var(--text-primary,#fff)",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "2.5px",
            textShadow: "0 2px 12px #0006, 0 1px 1px #222b"
          }}
        >
          {homeScore}:{awayScore}
        </span>
      </div>
      {/* Away team */}
      <div className="team-section flex flex-col items-center min-w-[74px] max-w-[120px] flex-1">
        {awayLogo ? (
          <img
            src={awayLogo}
            alt={awayTeam}
            className="team-logo"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 7,
              background: "#222",
              border: "2.5px solid #fff3",
              boxShadow: "0 2px 10px #13131d44",
            }}
          />
        ) : (
          <div
            className="team-logo flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#222",
              marginBottom: 7,
              border: "2.5px solid #fff1",
              color: "#fff7",
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: 1,
              textAlign: "center",
              boxShadow: "0 2px 10px #13131d44",
            }}
            aria-label={`${awayTeam} logo`}
          >
            {awayTeam[0] ? awayTeam[0].toUpperCase() : "A"}
          </div>
        )}
        <span
          className="team-name"
          style={{
            color: "var(--text-secondary,#e0e0e0)",
            fontFamily: "var(--font-primary), Inter, sans-serif",
            fontSize: 14,
            fontWeight: 400,
            textTransform: "capitalize",
            letterSpacing: "0.3px",
            textAlign: "center"
          }}
        >
          {awayTeam}
        </span>
      </div>
    </section>
  );
};

export default MatchInfoSection;
