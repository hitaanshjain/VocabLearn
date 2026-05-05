const DEFAULT_API_BASE_URL = 'https://vocab-learn-api.onrender.com';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  DEFAULT_API_BASE_URL
).replace(/\/$/, '');
