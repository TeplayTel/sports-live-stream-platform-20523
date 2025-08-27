import React from 'react';
import './emojiBar.css';

/**
 * PUBLIC_INTERFACE
 * Minimal player-like container whose sole purpose is to visually host the Emoji Bar UI.
 * No video functionality is included. This component follows the design spec in assets/emoji_bar_design_notes.md.
 */
const PlayerWithEmojiBarOnly = () => {
  // Static set as per design notes
  const emojis = [
    { label: 'Send heart reaction', symbol: '💖', special: true },
    { label: 'Send love eyes reaction', symbol: '😍' },
    { label: 'Send clap reaction', symbol: '👏' },
    { label: 'Send laugh reaction', symbol: '😂' },
    { label: 'Send wow reaction', symbol: '😮' },
    { label: 'Send fire reaction', symbol: '🔥' },
    { label: 'Send football reaction', symbol: '⚽' },
  ];

  // No-op handlers: visuals only
  const handlePrev = () => {};
  const handleNext = () => {};
  const handleEmojiClick = () => {};

  return (
    <div className="emoji-demo-wrapper">
      {/* Faux player surface just to showcase placement */}
      <div className="emoji-demo-surface" role="img" aria-label="Mock player surface to host emoji bar">
        <div className="emoji-demo-title">Emoji Bar Demo (UI only)</div>

        {/* Emoji Bar */}
        <div className="emoji-bar visible" role="group" aria-label="Emoji reactions toolbar">
          {/* Special emoji first */}
          {emojis.map((e, idx) => {
            const isSpecial = !!e.special;
            return (
              <button
                key={`${e.symbol}-${idx}`}
                className={`emoji${isSpecial ? ' special' : ''}`}
                aria-label={e.label}
                onClick={handleEmojiClick}
                type="button"
              >
                <span className="emoji-glyph" aria-hidden="true">{e.symbol}</span>
              </button>
            );
          })}

          <div className="spacer" aria-hidden="true" />

          {/* Navigation buttons (non-functional) */}
          <button
            className="nav-btn prev"
            aria-label="Previous reactions"
            onClick={handlePrev}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            className="nav-btn next"
            aria-label="Next reactions"
            onClick={handleNext}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerWithEmojiBarOnly;
