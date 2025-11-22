// Hybrid authentication service - uses API in production, localStorage in development
import { authApi } from './authApi';

// Check if we're in production (has API URL or deployed on Vercel)
// Always use API if we're not on localhost
const USE_API = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1'));

// Fallback to localStorage auth for development
const localStorageAuth = {
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  signUp: (email, password, name) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, hash this!
      name,
      watchlist: [],
      profiles: [
        {
          id: '1',
          name: name.split(' ')[0] || 'Profile 1',
          avatar: '👤',
          isKids: false,
        }
      ],
      currentProfile: '1',
      preferences: {
        autoplay: true,
        theme: 'dark',
      },
      continueWatching: [],
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorageAuth.setCurrentUser(newUser);
    
    return { success: true, user: newUser };
  },

  signIn: (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    localStorageAuth.setCurrentUser(user);
    return { success: true, user };
  },

  signOut: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
  },

  updateUser: (updatedUser) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      localStorageAuth.setCurrentUser(updatedUser);
    }
  },

  addToWatchlist: (item) => {
    const user = localStorageAuth.getCurrentUser();
    if (!user) return false;

    if (!user.watchlist.find(w => w.id === item.id && w.type === item.type)) {
      user.watchlist.push(item);
      localStorageAuth.updateUser(user);
      return true;
    }
    return false;
  },

  removeFromWatchlist: (id, type) => {
    const user = localStorageAuth.getCurrentUser();
    if (!user) return false;

    user.watchlist = user.watchlist.filter(w => !(w.id === id && w.type === type));
    localStorageAuth.updateUser(user);
    return true;
  },

  isInWatchlist: (id, type) => {
    const user = localStorageAuth.getCurrentUser();
    if (!user) return false;
    return user.watchlist.some(w => w.id === id && w.type === type);
  },

  addContinueWatching: (item, progress = 0) => {
    const user = localStorageAuth.getCurrentUser();
    if (!user) return false;

    const existing = user.continueWatching.find(cw => cw.id === item.id && cw.type === item.type);
    if (existing) {
      existing.progress = progress;
      existing.lastWatched = new Date().toISOString();
    } else {
      user.continueWatching.push({
        ...item,
        progress,
        lastWatched: new Date().toISOString(),
      });
    }
    localStorageAuth.updateUser(user);
    return true;
  },
};

// Export the appropriate auth service
export const authService = USE_API ? {
  getCurrentUser: async () => {
    return await authApi.getCurrentUser();
  },
  setCurrentUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (user.id) localStorage.setItem('userId', user.id);
  },
  signUp: authApi.signUp,
  signIn: authApi.signIn,
  signOut: authApi.signOut,
  updateUser: authApi.updateUser,
  addToWatchlist: authApi.addToWatchlist,
  removeFromWatchlist: authApi.removeFromWatchlist,
  isInWatchlist: (id, type) => {
    // Check localStorage first for immediate response
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      return userData.watchlist?.some(w => w.id === id && w.type === type) || false;
    }
    return false;
  },
  addContinueWatching: authApi.addContinueWatching,
} : localStorageAuth;
