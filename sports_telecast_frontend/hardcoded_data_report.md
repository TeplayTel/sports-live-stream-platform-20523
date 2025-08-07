# Hardcoded Data Analysis Report: sports_telecast_frontend

## Overview

This document identifies all hardcoded data instances related to:

- **Matches**
- **Highlights**
- **Schedules**
- **User Preferences**

in the React frontend (`sports_telecast_frontend`). This is in preparation for replacing all static/hardcoded data with dynamic backend API fetching.

---

## 1. Matches

### src/components/SportsCards.js

- **Relevant Code:**
  - The `matches` array is hardcoded within the component.
  - Contains fixtures for various sports with fields: id, homeTeam, awayTeam, scores, status, time, competition, sport, viewers, trending, featured, etc.
- **Usage:**
  - Used for filtering, sorting, and rendering each match card.
  - All match data is local and not fetched from the backend.
- **Action Required:** Replace `matches` array and dependent logic with fetch from `/matches/` and/or `/matches/live`, `/matches/more`, etc.

---

## 2. Highlights

- **Findings:**
  - **No dedicated Highlights component/file found in the main component directory**.
  - If highlights are shown (e.g., in match summary or after games), they are not currently implemented as a separate component or may be missing from this version.
  - **Action:** No hardcoded highlights found, but when highlights are implemented, ensure to fetch from `/highlights/` API.

---

## 3. Schedules

### src/components/AnalyticsPanel.js

- **Relevant Code:**
  - The `upcomingMatches` array is hardcoded (data for future matches).
    ```js
    const upcomingMatches = [
      { time: '15:30', teams: 'Liverpool vs Man City', ... },
      { time: '18:00', teams: 'Barcelona vs Real Madrid', ... },
      { time: '20:45', teams: 'PSG vs Bayern', ... }
    ];
    ```
  - Used in the "Upcoming Matches" tab display.

- **Additional:**
  - No current fetch logic for schedules or upcoming matches.
- **Action Required:** Replace `upcomingMatches` array with fetch to schedules endpoint, e.g. `/matches/schedule/upcoming` or `/schedules/upcoming`.

---

## 4. User Preferences

### src/components/SportsFilter.js

- **Relevant Code:**
  - The `sports` array, while not user-specific, acts as a static category filter:
    ```js
    const sports = [
      { name: 'All', count: 24 },
      { name: 'Football', count: 8 },
      ...
    ];
    ```
  - **Note:** True user preferences (favorites, notification settings, etc.) are not handled here. No current personal user preferences data is fetched or shown.

### Throughout the App (e.g. App.js, Header.js, etc.)

- No hardcoded user-specific preferences, favorites, or settings observed.
- No `useContext` for user preferences is present in preloaded components.
- **Action:** When implementing user preference logic, it should fetch from `/profiles/me`, `/auth/me`, or `/profiles/`, and support updates via the same.

---

## 5. Main App/Match Context

### src/App.js

- **Relevant Code:**
  - `currentMatch` is hardcoded with one match:
    ```js
    const [currentMatch] = useState({
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea', 
      homeScore: 2,
      awayScore: 1,
      status: 'LIVE',
      time: "67'",
      competition: 'Premier League'
    });
    ```
  - Provided as prop to `MatchInfoSection`, `VideoPlayer`, `MatchSummary`.
- **Action Required:** Replace with dynamic match data fetch, e.g. fetch from `/matches/{match_id}` or `/matches/live`.

---

## 6. Other Components

### src/components/MatchInfoSection.js, MatchSummary.js, AnalyticsPanel.js

- Consume the `currentMatch` prop (coming from the hardcoded state in App.js).
- May define other hardcoded objects (e.g., for events, stats, chatMessages, etc.) for demo purposes:

  - `MatchSummary.js`: Has hardcoded `events` and `lineup` arrays for timeline/lineup.
  - `AnalyticsPanel.js`: Hardcoded `stats` array and `chatMessages` for statistics and chat.

  These simulate live/updating data but are not bound to backend API.

---

## Summary Table

| File                        | Data Type      | Variable/Array Name      | Usage/Context                  |
|-----------------------------|---------------|-------------------------|--------------------------------|
| src/components/SportsCards.js    | Matches        | `matches`                 | Main matches grid/cards        |
| src/App.js                       | Match         | `currentMatch`            | Currently featured match       |
| src/components/AnalyticsPanel.js | Schedules/Stats| `upcomingMatches`, `stats`, `chatMessages` | Side panel: upcoming, stats, chat |
| src/components/MatchSummary.js   | Match Events/Lineup | `events`, `lineup`    | Match timeline and lineups     |
| src/components/SportsFilter.js   | Sports Filter | `sports`                  | Static filter buttons          |
| -                               | Highlights    | -                         | None present                   |
| -                               | User Preferences | -                      | None present                   |

---

## Next Steps (for refactor)

1. **Replace all hardcoded arrays and objects with data fetched from the backend REST API**.
2. **Pass dynamic/fetched data down via props or context as appropriate.**
3. **Implement loading/error states for all dynamic fetches.**
4. **For user preferences, add logic to query and update via `/profiles/me` or `/auth/me`.**

---

## API Mapping Reference

- **Matches List:** `/matches/` (GET), `/matches/live` (GET)
- **Single Match:** `/matches/{match_id}` (GET)
- **Highlights:** `/highlights/` (GET), `/matches/{match_id}/highlights` (GET)
- **Upcoming Schedules:** `/matches/schedule/upcoming`, `/schedules/upcoming`, `/matches/` with `status=scheduled`
- **User Preferences/Profile:** `/profiles/me` (GET), `/auth/me` (GET)

---

## Note

- Some components (e.g., chat, statistics in AnalyticsPanel, match events and lineups in MatchSummary) are demo-mocked and will also require API sources, likely from `/matches/{match_id}` or extended endpoints.
- No current highlighting, schedules, or user preferences UIs directly exist, but the above gives locations and strategy for refactor.

---
