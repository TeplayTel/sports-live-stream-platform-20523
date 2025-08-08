import React from "react";

// PUBLIC_INTERFACE
/**
 * MatchInfoSection
 * Compact, premium match info display for placement beneath the video player.
 * Accepts a "match" prop with fields:
 * {
 *   homeTeam: 'Arsenal', homeScore: 2, awayTeam: 'Chelsea', awayScore: 1,
 *   status: 'LIVE', time: "67'", competition: 'Premier League',
 *   homeLogo: <url>, awayLogo: <url>
 * }
 * 
 * Provides modern Netflix-like style, rounded/compact, glassy, and highly responsive.
 */
const MatchInfoSection = ({
  match = {
    homeTeam: 'Arsenal',
    homeScore: 2,
    awayTeam: 'Chelsea',
    awayScore: 1,
    status: 'LIVE',
    time: "67'",
    competition: 'Premier League',
    homeLogo: '',
    awayLogo: ''
  },
}) => {
  // Fallback logos (emoji as stand-in; replace with real image URLs if available)
  const homeLogo = match.homeLogo || "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg";
  const awayLogo = match.awayLogo || "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg";

  return (
    <section
      aria-label={`Match information: ${match.homeTeam} ${match.homeScore}, ${match.awayTeam} ${match.awayScore}`}
      className="match-info-section mx-auto mt-7 mb-8 w-full max-w-3xl rounded-xl px-4 py-3 sm:px-8 flex items-center shadow-xl bg-[rgba(23,20,34,0.94)] gap-4 sm:gap-8 hover-lift"
      style={{
        border: "1.5px solid #fff1",
        boxShadow: "0 4px 28px #0009, 0 1.5px 8px #2228",
        backdropFilter: "blur(14px)",
        minHeight: 74,
        justifyContent: "space-between",
        fontFamily: "var(--font-primary), sans-serif"
      }}
    >
      {/* Home Team */}
      <div className="team-section flex items-center gap-3 min-w-0 shrink grow flex-1">
        <img
          src={homeLogo}
          alt={`${match.homeTeam} logo`}
          className="team-logo"
          style={{
            width: 40, height: 40, objectFit: "contain",
            borderRadius: "50%",
            border: "2px solid #E74C3C22",
            background: "#1a1a1a",
            boxShadow: "0 2px 6px #0004"
          }}
        />
        <span
          className="team-name"
          style={{
            color: "var(--text-primary)",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: 0.35,
            textShadow: "0 1px 8px #0002"
          }}
        >
          {match.homeTeam}
        </span>
      </div>

      {/* Score Section */}
      <div className="score-section flex flex-col items-center px-4 py-2"
        style={{
          minWidth: 90,
          background: "rgba(14,14,20,0.82)",
          borderRadius: 7,
          border: "1.5px solid #fff1",
          margin: "0 14px",
          boxShadow: "0 2px 10px #0004"
        }}
        aria-label={`Current score ${match.homeScore} to ${match.awayScore}`}
      >
        <span
          className="score-text"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 29,
            fontWeight: 800,
            letterSpacing: 2,
            textShadow: "0 2px 12px #0006"
          }}
        >
          {match.homeScore}:{match.awayScore}
        </span>
        <span
          className="text-xs text-text-secondary mt-1"
          style={{
            color: "#b8c5d6cc"
          }}
        >{match.status === 'LIVE' ? <span className="text-accent-red pulse-glow px-3 py-0.5 bg-accent-red/80 rounded-lg font-bold mr-2">LIVE</span> : null}
          <span>{match.time || ''}</span>
        </span>
      </div>

      {/* Away Team */}
      <div className="team-section flex items-center gap-3 justify-end min-w-0 shrink grow flex-1">
        <span
          className="team-name text-right"
          style={{
            color: "var(--text-primary)",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: 0.35,
            textShadow: "0 1px 8px #0002"
          }}
        >
          {match.awayTeam}
        </span>
        <img
          src={awayLogo}
          alt={`${match.awayTeam} logo`}
          className="team-logo"
          style={{
            width: 40, height: 40, objectFit: "contain",
            borderRadius: "50%",
            border: "2px solid #3498DB22",
            background: "#1a1a1a",
            boxShadow: "0 2px 6px #0004"
          }}
        />
      </div>

      {/* Competition badge, right-aligned on large screens */}
      <div className="hidden sm:flex flex-col items-end ml-6">
        <span
          className="competition-badge px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: "var(--accent-blue)",
            color: "#fff",
            letterSpacing: 1.1,
            marginBottom: 2,
            boxShadow: "0 0 8px #2196f380"
          }}
        >{match.competition || ""}</span>
      </div>
    </section>
  );
};

export default MatchInfoSection;
