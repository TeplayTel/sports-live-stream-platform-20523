// PUBLIC_INTERFACE
/**
 * Emoji service for backend API integration
 * Handles emoji reactions, fetching available emojis, and event summaries
 */

class EmojiService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    this.token = null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
  }

  // Get authorization headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Handle API response
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // PUBLIC_INTERFACE
  /**
   * Get list of available emojis
   * @param {number} pageNo - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 10)
   * @returns {Promise<Object>} Emoji list response
   */
  async getEmojis(pageNo = 1, pageSize = 10) {
    try {
      const url = `${this.apiUrl}/fan-engagement/emoji/v1/listEmojis?pageNo=${pageNo}&pageSize=${pageSize}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching emojis:', error);
      throw error;
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Submit an emoji reaction for a live event
   * @param {string} eventId - Event identifier
   * @param {string} emojiId - Emoji identifier
   * @returns {Promise<Object>} Reaction response
   */
  async submitReaction(eventId, emojiId) {
    try {
      const url = `${this.apiUrl}/fan-engagement/emoji/v1/userEmojiReaction`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          event_id: eventId,
          emoji_id: emojiId,
          created_at: new Date().toISOString()
        }),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error submitting reaction:', error);
      throw error;
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get emoji reaction summary for an event
   * @param {string} eventId - Event identifier
   * @returns {Promise<Object>} Reaction summary
   */
  async getEventReactions(eventId) {
    try {
      const url = `${this.apiUrl}/fan-engagement/emoji/v1/reactions/${eventId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching event reactions:', error);
      throw error;
    }
  }

  // Fallback emoji data for when API is unavailable
  getFallbackEmojis() {
    return {
      status: 'SUCCESS',
      emojis: [
        {
          emoji_id: 'EMJ001',
          emoji_type: 'heart',
          name: 'Love',
          image_url: '',
          is_active: true,
          sort_order: 1
        },
        {
          emoji_id: 'EMJ002',
          emoji_type: 'laugh',
          name: 'Laugh',
          image_url: '',
          is_active: true,
          sort_order: 2
        },
        {
          emoji_id: 'EMJ003',
          emoji_type: 'shocked',
          name: 'Wow',
          image_url: '',
          is_active: true,
          sort_order: 3
        },
        {
          emoji_id: 'EMJ004',
          emoji_type: 'clap',
          name: 'Clap',
          image_url: '',
          is_active: true,
          sort_order: 4
        },
        {
          emoji_id: 'EMJ005',
          emoji_type: 'fire',
          name: 'Fire',
          image_url: '',
          is_active: true,
          sort_order: 5
        },
        {
          emoji_id: 'EMJ006',
          emoji_type: 'goal',
          name: 'Soccer',
          image_url: '',
          is_active: true,
          sort_order: 6
        }
      ],
      total: 6,
      page: 1,
      page_size: 10
    };
  }
}

// Create and export singleton instance
const emojiService = new EmojiService();
export default emojiService;
