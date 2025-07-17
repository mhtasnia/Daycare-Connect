
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/bookings/daycare/';

export const getBookings = () => {
  return axios.get(`${API_URL}bookings/`);
};

export const updateBookingStatus = (id, status) => {
  const action = status === 'Accepted' ? 'accept' : 'decline';
  return axios.post(`${API_URL}bookings/${id}/${action}/`);
};

export const getBookingHistory = () => {
  return axios.get(`${API_URL}history/summary/`);
};
