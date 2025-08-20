import React, { useEffect, useState } from 'react';
import emojiService from '../services/emojiService';
import LoadingSpinner from './LoadingSpinner';

// PUBLIC_INTERFACE
/**
 * EmojiList
 * 
 * Fetches the emoji list from backend and displays them as images.
 * Shows a loading state and handles errors gracefully.
 * Each emoji is rendered using its imageUrl; emojiType/name used for alt/title.
 */
const EmojiList = () => {
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the emoji list from backend
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await emojiService.getEmojis(1, 50);
        const list = Array.isArray(data?.emojis) ? data.emojis : [];

        if (isMounted) {
          // Normalize keys to consistent casing for imageUrl and emojiType
          const normalized = list
            .filter((e) => e?.is_active !== false) // show active emojis; if missing, assume active
            .sort((a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0))
            .map((e) => ({
              id: e.emoji_id || e.emojiId || e.id,
              emojiType: e.emoji_type || e.emojiType || e.name || 'emoji',
              imageUrl: e.image_url || e.imageUrl || '',
              name: e.name || e.emoji_type || e.emojiType || 'Emoji',
            }));
          setEmojis(normalized);
        }
      } catch (err) {
        console.error('Failed to load emojis:', err);
        if (isMounted) {
          setError('Failed to load emojis from server.');
          setEmojis([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => { isMounted = false; };
  }, []);

  return (
    <section
      aria-label="Available emojis"
      className="bg-secondary-bg rounded-xl p-4 hover-lift"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-bold text-text-primary">
          Available Emojis
        </h3>
        {loading && (
          <div className="flex items-center space-x-2 text-text-secondary">
            <LoadingSpinner size="sm" />
            <span className="text-sm">Loading...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-2 bg-yellow-900/60 rounded text-yellow-300 text-sm mb-3">
          {error}
        </div>
      )}

      {!loading && !error && emojis.length === 0 && (
        <div className="text-text-muted text-sm">
          No emojis available.
        </div>
      )}

      {!loading && emojis.length > 0 && (
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
          }}
        >
          {emojis.map((emoji, idx) => (
            <figure
              key={emoji.id || idx}
              className="bg-tertiary-bg rounded-lg p-2 flex flex-col items-center justify-center hover:bg-hover-bg transition-all duration-200 border border-border-color"
              title={emoji.emojiType || emoji.name}
            >
              {emoji.imageUrl ? (
                <img
                  src={emoji.imageUrl}
                  alt={emoji.emojiType || emoji.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    // graceful fallback to text if image fails
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextSibling;
                    if (fallback) fallback.style.display = 'inline-block';
                  }}
                />
              ) : null}
              <span
                className="text-white text-2xl leading-none"
                style={{ display: emoji.imageUrl ? 'none' : 'inline-block' }}
                aria-hidden={!!emoji.imageUrl}
              >
                {/* If image missing, show a text fallback (first letter) */}
                {(emoji.emojiType || emoji.name || 'E').slice(0, 1).toUpperCase()}
              </span>
              <figcaption className="text-xs text-text-secondary mt-2 text-center truncate w-full">
                {emoji.emojiType || emoji.name}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
};

export default EmojiList;
