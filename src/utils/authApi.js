// API-based authentication service for production
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const authApi = {
  // Sign up
  signUp: async (email, password, name) => {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user ID in localStorage for session management
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  },

  // Sign in
  signIn: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.error || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Signin error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;

    try {
      const response = await fetch(`${API_BASE}/auth/user?userId=${userId}`);
      const user = await response.json();

      if (user.error) {
        localStorage.removeItem('userId');
        localStorage.removeItem('currentUser');
        return null;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    }
  },

  // Update user
  updateUser: async (updatedUser) => {
    try {
      const response = await fetch(`${API_BASE}/auth/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: updatedUser.id,
          preferences: updatedUser.preferences,
        }),
      });

      if (response.ok) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  },

  // Add to watchlist
  addToWatchlist: async (item) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return false;

    try {
      const response = await fetch(`${API_BASE}/watchlist?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId: item.id,
          title: item.title,
          poster: item.poster,
          type: item.type,
          releaseDate: item.releaseDate,
          rating: item.rating,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Add to watchlist error:', error);
      return false;
    }
  },

  // Remove from watchlist
  removeFromWatchlist: async (id, type) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return false;

    try {
      const response = await fetch(`${API_BASE}/watchlist?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId: id, type }),
      });

      return response.ok;
    } catch (error) {
      console.error('Remove from watchlist error:', error);
      return false;
    }
  },

  // Check if in watchlist
  isInWatchlist: async (id, type) => {
    const user = await authApi.getCurrentUser();
    if (!user) return false;
    return user.watchlist?.some(w => w.id === id && w.type === type) || false;
  },

  // Add continue watching
  addContinueWatching: async (item, progress = 0) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return false;

    try {
      const response = await fetch(`${API_BASE}/continue-watching?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId: item.id,
          title: item.title,
          poster: item.poster,
          type: item.type,
          progress,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Add continue watching error:', error);
      return false;
    }
  },

  // Sign out
  signOut: () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
  },
};

