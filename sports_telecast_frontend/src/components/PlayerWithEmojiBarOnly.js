import React, { useEffect, useMemo, useState } from 'react';
import './emojiBar.css';
import ApiService from '../services/api';

/**
 * PUBLIC_INTERFACE
 * Minimal player-like container whose sole purpose is to visually host the Emoji Bar UI.
 * Now fetches emoji images dynamically from backend GET /fan-engagement/emoji/v1/listEmojis and renders icons.
 * No video functionality is included. This component follows the design spec in assets/emoji_bar_design_notes.md.
 */
const PlayerWithEmojiBarOnly = () => {
  /**
   * Local UI state for dynamic emoji list.
   * The backend is expected to return an object like:
   * {
   *   emojis: [{ id, name, description, imageUrl, isSpecial }, ...],
   *   pageNo, pageSize, total
   * }
   */
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Fetch emojis on mount
  useEffect(() => {
    let isMounted = true;
    const fetchEmojis = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const data = await ApiService.getEmojis(1, 20);
        const items = Array.isArray(data?.emojis) ? data.emojis : Array.isArray(data) ? data : [];
        if (isMounted) setEmojis(items);
      } catch (err) {
        console.error('Failed to load emojis:', err);
        if (isMounted) setLoadError('Unable to load reactions');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchEmojis();
    return () => {
      isMounted = false;
    };
  }, []);

  // Separate "special" emoji (first highlighted heart-like) from regular ones based on backend flag or heuristic
  const { specialEmoji, regularEmojis } = useMemo(() => {
    if (!emojis || emojis.length === 0) return { specialEmoji: null, regularEmojis: [] };
    const markedSpecial = emojis.find(e => e.isSpecial === true);
    if (markedSpecial) {
      return {
        specialEmoji: markedSpecial,
        regularEmojis: emojis.filter(e => e !== markedSpecial),
      };
    }
    // Heuristic fallback: first emoji becomes special
    return { specialEmoji: emojis[0], regularEmojis: emojis.slice(1) };
  }, [emojis]);

  // Placeholder handlers for UI only; POST will be wired in a subsequent step
  const handlePrev = () => {};
  const handleNext = () => {};
  const handleEmojiClick = async (emoji) => {
    /**
     * Handle click on an emoji icon from the emoji bar.
     * Sends a POST to /fan-engagement/emoji/v1/userEmojiReaction with payload:
     * { userId, eventId, emojiId, createdAt }
     * For now, uses dummy placeholders for userId and eventId.
     */
    if (!emoji) return;
    const emojiId = emoji?.id || emoji?.emojiId || emoji?.emoji_id || emoji?.name || 'unknown';
    const payload = {
      userId: 'USR001',
      eventId: 'EVT001',
      emojiId,
      createdAt: new Date().toISOString(),
    };

    try {
      // Prefer the explicit API if available; fallback to generic client if necessary
      if (typeof ApiService.postUserEmojiReaction === 'function') {
        await ApiService.postUserEmojiReaction(payload);
      } else if (typeof ApiService.submitEmojiReaction === 'function') {
        // Legacy submit call (different shape) – keep for compatibility if backend accepts it
        await ApiService.submitEmojiReaction(payload.eventId, payload.emojiId);
      }
      // Optional: local success feedback could be added here (e.g. animation/sound)
      // console.debug('Reaction submitted:', payload);
    } catch (e) {
      // Log non-blocking error; UI remains responsive
      console.error('Failed to submit emoji reaction', e);
    }
  };

  // Helper: Alt label for accessibility
  const getEmojiAriaLabel = (emoji) => {
    const name = emoji?.name || 'emoji';
    return `Send ${name} reaction`;
  };

  // Render helper: single emoji button (image-based)
  const EmojiButton = ({ emoji, isSpecial = false }) => {
    const key = emoji?.id || emoji?.name || emoji?.imageUrl || Math.random().toString(36).slice(2);
    const title = emoji?.description || emoji?.name || 'Reaction';
    const imageUrl = emoji?.imageUrl || emoji?.icon || emoji?.url; // try common fields defensively

    return (
      <button
        key={key}
        className={`emoji${isSpecial ? ' special' : ''}`}
        aria-label={getEmojiAriaLabel(emoji)}
        onClick={() => handleEmojiClick(emoji)}
        type="button"
        title={title}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={emoji?.name || 'emoji'}
            className="emoji-glyph"
            style={{ width: 24, height: 24, objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <span className="emoji-glyph" aria-hidden="true">🙂</span>
        )}
      </button>
    );
  };

  return (
    <div className="emoji-demo-wrapper">
      {/* Faux player surface just to showcase placement */}
      <div className="emoji-demo-surface" role="img" aria-label="Mock player surface to host emoji bar">
        <div className="emoji-demo-title">Emoji Bar Demo (images from API)</div>

        {/* Emoji Bar */}
        <div className="emoji-bar visible" role="group" aria-label="Emoji reactions toolbar">
          {/* Loading and error states inline to keep the layout stable */}
          {loading && (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={`skeleton-${i}`} className="emoji" aria-hidden="true" style={{ opacity: 0.4 }}>
                  <div
                    className="emoji-glyph"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: 'rgba(255,255,255,0.2)',
                    }}
                  />
                </div>
              ))}
            </>
          )}

          {!loading && loadError && (
            <div
              role="status"
              aria-live="polite"
              style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, padding: '4px 8px' }}
            >
              {loadError}
            </div>
          )}

          {!loading && !loadError && (
            <>
              {/* Special emoji first (if available) */}
              {specialEmoji && <EmojiButton emoji={specialEmoji} isSpecial />}

              {/* The rest */}
              {regularEmojis.map((e) => (
                <EmojiButton key={e?.id || e?.name || e?.imageUrl} emoji={e} />
              ))}
            </>
          )}

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
