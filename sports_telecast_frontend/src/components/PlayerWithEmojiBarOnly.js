import React, { useMemo, useRef, useState, useCallback } from 'react';
import './emojiBar.css';

/**
 * PUBLIC_INTERFACE
 * Minimal player-like container whose sole purpose is to visually host the Emoji Bar UI.
 * This version intentionally uses a hardcoded emoji set and a refined CSS animation on click
 * that matches the "easy breezy" spec from assets/emoji_fly_animation_notes.md.
 */
const PlayerWithEmojiBarOnly = () => {
  /**
   * Hardcoded emoji set for animation testing (no backend).
   * The first entry is treated as the "special" highlighted emoji.
   */
  const HARD_EMOJIS = useMemo(
    () => ([
      { id: 'spark-heart', name: 'favorite', description: 'Favorite', glyph: '💖', isSpecial: true },
      { id: 'love-eyes', name: 'love-eyes', description: 'Love eyes', glyph: '😍' },
      { id: 'clap', name: 'clap', description: 'Clap', glyph: '👏' },
      { id: 'joy', name: 'joy', description: 'Tears of joy', glyph: '😂' },
      { id: 'wow', name: 'wow', description: 'Wow', glyph: '😮' },
      { id: 'fire', name: 'fire', description: 'Fire', glyph: '🔥' },
      { id: 'soccer', name: 'soccer', description: 'Football', glyph: '⚽' },
    ]),
    []
  );

  const { specialEmoji, regularEmojis } = useMemo(() => {
    const special = HARD_EMOJIS.find(e => e.isSpecial) || HARD_EMOJIS[0];
    const rest = HARD_EMOJIS.filter(e => e !== special);
    return { specialEmoji: special, regularEmojis: rest };
  }, [HARD_EMOJIS]);

  // Local state for transient "flying" emojis
  const [flying, setFlying] = useState([]);
  const idCounter = useRef(0);
  const barRef = useRef(null);

  const handlePrev = () => {};
  const handleNext = () => {};

  // Util: random within range (exportable for tests)
  const rand = (min, max) => Math.random() * (max - min) + min;

  /**
   * Create a deterministic set of items for testing if a seed is provided (optional).
   * This allows unit tests to assert counts and basic structure without relying on timing.
   */
  const makeBurstItems = useCallback((glyph, spawnOffsetX, seed = null) => {
    const random = seed != null
      ? (() => {
          // Simple LCG for predictable pseudo-randoms in tests
          let s = seed;
          return () => {
            s = (s * 1664525 + 1013904223) % 4294967296;
            return s / 4294967296;
          };
        })()
      : Math.random;

    const r = (min, max) => random() * (max - min) + min;

    const baseNow = Date.now();
    const burstCount = Math.floor(r(3, 7)); // 3..6 inclusive

    return Array.from({ length: burstCount }).map((_, i) => {
      const id = `fly-${baseNow}-${idCounter.current++}`;

      const dur = r(1.85, 2.05);
      const delay = Math.max(0, Math.min(0.25, r(0.06 * i, 0.12 + 0.05 * i)));

      const baseX = r(22, 38);
      const jitter = r(-18, 18);
      const maybeFlip = r(0, 1) < 0.28 ? -1 : 1;
      const flyX = Math.round((baseX + jitter + spawnOffsetX) * maybeFlip);

      const flyY = '-62vh';

      const wobbleAmp = r(6, 12);
      const scaleStart = r(0.9, 0.96);
      const scalePeak = r(1.08, 1.14);
      const scaleEnd = r(0.96, 1.0);
      const rot = `${r(-6, 6).toFixed(1)}deg`;

      return {
        id,
        glyph,
        vars: {
          '--fly-dur': `${dur.toFixed(2)}s`,
          '--fly-delay': `${delay.toFixed(2)}s`,
          '--fly-x': `${flyX}px`,
          '--fly-y': flyY,
          '--wobble-amp': `${wobbleAmp.toFixed(1)}px`,
          '--scale-start': scaleStart.toFixed(2),
          '--scale-peak': scalePeak.toFixed(2),
          '--scale-end': scaleEnd.toFixed(2),
          '--rot': rot
        }
      };
    });
  }, []);

  /**
   * Spawn a burst of emojis with randomized motion seeds.
   * Nodes are removed automatically on animationend for proper cleanup.
   * Ensures 3–6 visible nodes with reliable stagger and durations to avoid instant disappearance.
   */
  const spawnEmojiBurst = useCallback((glyph, spawnOffsetX = 0) => {
    const newItems = makeBurstItems(glyph, spawnOffsetX);
    setFlying(prev => {
      const combined = [...prev, ...newItems];
      // keep last 60 for overlaps while preventing leaks
      return combined.slice(-60);
    });
  }, [makeBurstItems]);

  /**
   * On emoji click we compute an offset so the burst appears to originate near the clicked emoji,
   * then spawn the burst.
   */
  const handleEmojiClick = (emoji, evt) => {
    if (!emoji) return;

    let offsetX = 0;
    if (barRef.current && evt?.currentTarget) {
      try {
        const barRect = barRef.current.getBoundingClientRect();
        const btnRect = evt.currentTarget.getBoundingClientRect();
        const btnCenter = btnRect.left + btnRect.width / 2;
        const barCenter = barRect.left + barRect.width / 2;
        // clamp offset influence to keep paths onscreen
        offsetX = Math.max(-80, Math.min(80, btnCenter - barCenter));
      } catch {
        offsetX = 0;
      }
    }

    // Slightly stronger offset to better separate bursts across the row
    spawnEmojiBurst(emoji.glyph, offsetX * 0.6);
  };

  // Helper: Alt label for accessibility
  const getEmojiAriaLabel = (emoji) => {
    const name = emoji?.description || emoji?.name || 'emoji';
    return `Send ${name} reaction`;
  };

  // Render helper: single emoji button (Unicode-based)
  const EmojiButton = ({ emoji, isSpecial = false }) => {
    const key = emoji?.id || emoji?.name;

    return (
      <button
        key={key}
        className={`emoji${isSpecial ? ' special' : ''}`}
        aria-label={getEmojiAriaLabel(emoji)}
        onClick={(e) => handleEmojiClick(emoji, e)}
        type="button"
        title={emoji?.description || emoji?.name || 'Reaction'}
      >
        <span className="emoji-glyph" aria-hidden="true" style={{ fontSize: 24, display: 'block' }}>
          {emoji.glyph}
        </span>
      </button>
    );
  };

  return (
    <div className="emoji-demo-wrapper">
      {/* Faux player surface just to showcase placement */}
      <div className="emoji-demo-surface" role="img" aria-label="Mock player surface to host emoji bar">
        <div className="emoji-demo-title">Emoji Bar Demo (hardcoded, with fly animation)</div>

        {/* Emoji Bar */}
        <div ref={barRef} className="emoji-bar visible" role="group" aria-label="Emoji reactions toolbar">
          {/* Special emoji first */}
          {specialEmoji && <EmojiButton emoji={specialEmoji} isSpecial />}

          {/* Standard set */}
          {regularEmojis.map((e) => (
            <EmojiButton key={e.id} emoji={e} />
          ))}

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

          {/* Transient flying emojis */}
          <div className="emoji-fly-layer" aria-hidden="true">
            {flying.map((f) => (
              <span
                key={f.id}
                className="flying-emoji"
                style={{
                  '--fly-dur': f.vars['--fly-dur'],
                  '--fly-delay': f.vars['--fly-delay'],
                  '--fly-x': f.vars['--fly-x'],
                  '--fly-y': f.vars['--fly-y'],
                  '--wobble-amp': f.vars['--wobble-amp'],
                  '--scale-start': f.vars['--scale-start'],
                  '--scale-peak': f.vars['--scale-peak'],
                  '--scale-end': f.vars['--scale-end'],
                  '--rot': f.vars['--rot']
                }}
                onAnimationEnd={() => {
                  // Robust cleanup in case multiple animations are attached by the browser
                  setFlying(prev => prev.filter(x => x.id !== f.id));
                }}
              >
                <span className="flying-emoji-wobble">{f.glyph}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * PUBLIC_INTERFACE
 * Export helper to facilitate unit testing of burst generation.
 */
export const __testables__ = {
  // Note: makeBurstItems uses a deterministic RNG when a seed is passed.
  createBurstForTest: (componentInstance, glyph = '💖', spawnOffsetX = 0, seed = 1234) => {
    return componentInstance?.makeBurstItems
      ? componentInstance.makeBurstItems(glyph, spawnOffsetX, seed)
      : [];
  }
};

export default PlayerWithEmojiBarOnly;
