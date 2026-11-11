const KEY = "playbold_recent_searches";
const MAX_ITEMS = 8;

export const getRecentSearches = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = (query) => {
  const q = query?.trim();
  if (!q) return;

  try {
    const rest = getRecentSearches().filter(
      (item) => item.toLowerCase() !== q.toLowerCase()
    );
    localStorage.setItem(KEY, JSON.stringify([q, ...rest].slice(0, MAX_ITEMS)));
  } catch (err) {
    console.error("Recent search save error:", err.message);
  }
};

export const removeRecentSearch = (query) => {
  try {
    const rest = getRecentSearches().filter((item) => item !== query);
    localStorage.setItem(KEY, JSON.stringify(rest));
  } catch {
    /* ignore */
  }
};

export const clearRecentSearches = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
};