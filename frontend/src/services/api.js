import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header with token
// This will automatically attach the token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access', access);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.clear();
        window.location.href = '/parent/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/user-auth/parents/login/', credentials),
  register: (userData) => api.post('/user-auth/parents/register/', userData),
  logout: (refreshToken) => api.post('/user-auth/parents/logout/', { refresh: refreshToken }),
  sendOTP: (email, purpose = 'registration') => api.post('/user-auth/send-otp/', { email, purpose }),
  verifyOTP: (email, otp_code, purpose = 'registration') => api.post('/user-auth/verify-otp/', { email, otp_code, purpose }),
  getProfile: () => api.get('/user-auth/parents/profile/'),
  updateProfile: (profileData) => api.put('/user-auth/parents/profile/update/', profileData),
};

// Booking API
export const bookingAPI = {
  // Daycare search and discovery
  searchDaycares: (params) => api.get('/bookings/daycares/search/', { params }),
  getDaycareDetail: (id) => api.get(`/bookings/daycares/${id}/`),
  getPopularDaycares: () => api.get('/bookings/daycares/popular/'),
  getNearbyDaycares: () => api.get('/bookings/daycares/nearby/'),
  
  // Booking management
  getBookings: (params) => api.get('/bookings/bookings/', { params }),
  createBooking: (bookingData) => api.post('/bookings/bookings/create/', bookingData),
  getBookingDetail: (id) => api.get(`/bookings/bookings/${id}/`),
  updateBooking: (id, bookingData) => api.put(`/bookings/bookings/${id}/update/`, bookingData),
  cancelBooking: (id, reason) => api.post(`/bookings/bookings/${id}/cancel/`, { cancellation_reason: reason }),
  
  // Reviews and messages
  createReview: (bookingId, reviewData) => api.post(`/bookings/bookings/${bookingId}/review/`, reviewData),
  getBookingMessages: (bookingId) => api.get(`/bookings/bookings/${bookingId}/messages/`),
  sendMessage: (bookingId, messageData) => api.post(`/bookings/bookings/${bookingId}/messages/create/`, messageData),
  
  // Statistics
  getBookingStats: () => api.get('/bookings/stats/'),
  getBookingHistorySummary: () => api.get('/bookings/history/summary/'),
};

// Children API
export const childrenAPI = {
  getChildren: () => api.get('/user-auth/parents/children/'),
  addChild: (childData) => api.post('/user-auth/parents/children/', childData),
  updateChild: (id, childData) => api.put(`/user-auth/parents/children/${id}/`, childData),
  deleteChild: (id) => api.delete(`/user-auth/parents/children/${id}/`),
};

// Emergency Contact API
export const emergencyContactAPI = {
  getEmergencyContact: () => api.get('/user-auth/parents/emergency-contact/'),
  saveEmergencyContact: (contactData) => api.post('/user-auth/parents/emergency-contact/', contactData),
  updateEmergencyContact: (contactData) => api.put('/user-auth/parents/emergency-contact/update/', contactData),
  deleteEmergencyContact: () => api.delete('/user-auth/parents/emergency-contact/update/'),
};

export default api;