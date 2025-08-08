import React, { createContext, useContext } from 'react';

// Mock user info to be used globally
export const MOCK_USER = {
  user_id: 'mock-user-001',
  username: 'mockfan',
  email: 'mockfan@example.com',
  avatar_url: 'https://i.pravatar.cc/120?u=mockfan',
  preferences: {
    favorite_teams: ['Arsenal', 'Chelsea'],
    favorite_sports: ['football'],
    notification_settings: {
      match_updates: true,
      highlights: true,
    },
    preferred_language: 'en',
    timezone: 'UTC',
  },
  role: 'user',
};

// Context
const UserContext = createContext({
  user: MOCK_USER,
  isLoggedIn: true,
});

/**
 * UserProvider wraps children and provides mock user context (always logged in)
 */
export function UserProvider({ children }) {
  return (
    <UserContext.Provider value={{ user: MOCK_USER, isLoggedIn: true }}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * useUser hook to access user and login state
 */
export function useUser() {
  return useContext(UserContext);
}

export default UserContext;
