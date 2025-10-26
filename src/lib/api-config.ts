// API Configuration
// Change this to your backend URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const API_ENDPOINTS = {
  videos: `${API_BASE_URL}/videos/`,
  videoDetail: (id: string | number) => `${API_BASE_URL}/videos/${id}/`,
  videoStatus: (id: string | number) => `${API_BASE_URL}/videos/${id}/status/`,
};
