import axios from 'axios';

// PUBLIC_INTERFACE
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
class ApiService {
  // Health check
  static async healthCheck() {
    /**
     * Check API health and status
     * @returns {Promise<Object>} API health information
     */
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Matches API
  static async getMatches(page = 1, pageSize = 20, status = null, sport = null) {
    /**
     * Get paginated list of matches
     * @param {number} page - Page number
     * @param {number} pageSize - Page size
     * @param {string} status - Filter by match status
     * @param {string} sport - Filter by sport type
     * @returns {Promise<Object>} Match list response
     */
    try {
      const params = new URLSearchParams({ page, page_size: pageSize });
      if (status) params.append('status', status);
      if (sport) params.append('sport', sport);
      
      const response = await apiClient.get(`/matches?${params}`);
      return response.data;
    } catch (error) {
      console.error('Get matches failed:', error);
      throw error;
    }
  }

  static async getLiveMatches() {
    /**
     * Get all currently live matches
     * @returns {Promise<Object>} Live matches response
     */
    try {
      const response = await apiClient.get('/matches/live');
      return response.data;
    } catch (error) {
      console.error('Get live matches failed:', error);
      throw error;
    }
  }

  static async getMatchDetails(matchId) {
    /**
     * Get detailed information about a specific match
     * @param {string} matchId - Match ID
     * @returns {Promise<Object>} Match details
     */
    try {
      const response = await apiClient.get(`/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error('Get match details failed:', error);
      throw error;
    }
  }

  static async getUpcomingMatches(days = 7, page = 1, pageSize = 20) {
    /**
     * Get upcoming scheduled matches
     * @param {number} days - Number of days to look ahead
     * @param {number} page - Page number
     * @param {number} pageSize - Page size
     * @returns {Promise<Object>} Upcoming matches response
     */
    try {
      const params = new URLSearchParams({ days, page, page_size: pageSize });
      const response = await apiClient.get(`/matches/schedule/upcoming?${params}`);
      return response.data;
    } catch (error) {
      console.error('Get upcoming matches failed:', error);
      throw error;
    }
  }

  // Events API
  static async getEvents(page = 1, pageSize = 20, sport = null, featured = null) {
    /**
     * Get paginated list of sports events
     * @param {number} page - Page number
     * @param {number} pageSize - Page size
     * @param {string} sport - Filter by sport type
     * @param {boolean} featured - Filter featured events
     * @returns {Promise<Object>} Events list response
     */
    try {
      const params = new URLSearchParams({ page, page_size: pageSize });
      if (sport) params.append('sport', sport);
      if (featured !== null) params.append('featured', featured);
      
      const response = await apiClient.get(`/events?${params}`);
      return response.data;
    } catch (error) {
      console.error('Get events failed:', error);
      throw error;
    }
  }

  static async getEventDetails(eventId) {
    /**
     * Get detailed information about a specific event
     * @param {string} eventId - Event ID
     * @returns {Promise<Object>} Event details
     */
    try {
      const response = await apiClient.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Get event details failed:', error);
      throw error;
    }
  }

  // Highlights API
  static async getHighlights(page = 1, pageSize = 20, matchId = null) {
    /**
     * Get paginated list of match highlights
     * @param {number} page - Page number
     * @param {number} pageSize - Page size
     * @param {string} matchId - Filter by match ID
     * @returns {Promise<Object>} Highlights list response
     */
    try {
      const params = new URLSearchParams({ page, page_size: pageSize });
      if (matchId) params.append('match_id', matchId);
      
      const response = await apiClient.get(`/highlights?${params}`);
      return response.data;
    } catch (error) {
      console.error('Get highlights failed:', error);
      throw error;
    }
  }

  static async getFeaturedHighlights(limit = 10) {
    /**
     * Get latest featured highlights
     * @param {number} limit - Number of highlights to return
     * @returns {Promise<Object>} Featured highlights response
     */
    try {
      const response = await apiClient.get(`/highlights/featured/latest?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get featured highlights failed:', error);
      throw error;
    }
  }

  // Emoji Reactions API
  static async getEmojis(pageNo = 1, pageSize = 10) {
    /**
     * Get paginated list of available emojis
     * @param {number} pageNo - Page number
     * @param {number} pageSize - Page size
     * @returns {Promise<Object>} Emojis list response
     */
    try {
      const params = new URLSearchParams({ pageNo, pageSize });
      const response = await apiClient.get(`/fan-engagement/emoji/v1/listEmojis?${params}`);
      return response.data;
    } catch (error) {
      console.error('Get emojis failed:', error);
      throw error;
    }
  }

  static async submitEmojiReaction(eventId, emojiId) {
    /**
     * Submit an emoji reaction (legacy helper retained for compatibility).
     * Note: Backend for this project expects camelCase keys via userEmojiReaction; this method
     * posts minimal keys in snake_case only for legacy fallbacks where supported.
     * Prefer postUserEmojiReaction for the required payload.
     * @param {string} eventId - Event ID
     * @param {string} emojiId - Emoji ID
     * @returns {Promise<Object>} Reaction response
     */
    try {
      const response = await apiClient.post('/fan-engagement/emoji/v1/userEmojiReaction', {
        event_id: eventId,
        emoji_id: emojiId
      });
      return response.data;
    } catch (error) {
      console.error('Submit emoji reaction failed:', error);
      throw error;
    }
  }

  // PUBLIC_INTERFACE
  static async postUserEmojiReaction({ userId, eventId, emojiId, createdAt }) {
    /**
     * Post a user emoji reaction with the required payload shape.
     * @param {Object} params
     * @param {string} params.userId - User ID (use dummy if not available)
     * @param {string} params.eventId - Event ID (use dummy if not available)
     * @param {string} params.emojiId - The clicked emoji's id
     * @param {string} params.createdAt - ISO timestamp when reaction is created
     * @returns {Promise<Object>} API response
     */
    try {
      const body = { userId, eventId, emojiId, createdAt };
      const response = await apiClient.post('/fan-engagement/emoji/v1/userEmojiReaction', body);
      return response.data;
    } catch (error) {
      console.error('postUserEmojiReaction failed:', error);
      throw error;
    }
  }

  static async getEventReactions(eventId) {
    /**
     * Get emoji reaction summary for a specific event
     * @param {string} eventId - Event ID
     * @returns {Promise<Object>} Reaction summary
     */
    try {
      const response = await apiClient.get(`/fan-engagement/emoji/v1/reactions/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Get event reactions failed:', error);
      throw error;
    }
  }

  // Authentication API (if needed)
  static async login(email, password) {
    /**
     * User login
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Login response with token
     */
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.access_token) {
        localStorage.setItem('authToken', response.data.access_token);
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  static async register(userData) {
    /**
     * User registration
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Registration response
     */
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  static logout() {
    /**
     * User logout - clears local token
     */
    localStorage.removeItem('authToken');
  }

  // WebSocket connection helper
  static createWebSocketConnection(eventId, token = null) {
    /**
     * Create WebSocket connection for real-time updates
     * @param {string} eventId - Event ID
     * @param {string} token - Auth token
     * @returns {WebSocket} WebSocket connection
     */
    const wsUrl = API_BASE_URL.replace('http', 'ws');
    const tokenParam = token || localStorage.getItem('authToken');
    const url = `${wsUrl}/ws/${eventId}${tokenParam ? `?token=${tokenParam}` : ''}`;
    
    return new WebSocket(url);
  }
}

export default ApiService;
