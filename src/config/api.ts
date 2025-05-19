export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'https://absensi.dmpt.my.id',
  endpoints: {
    login: '/api/login',
  },
};

export const getApiUrl = (endpoint: keyof typeof API_CONFIG.endpoints) => {
  return `${API_CONFIG.baseURL}${API_CONFIG.endpoints[endpoint]}`;
}; 