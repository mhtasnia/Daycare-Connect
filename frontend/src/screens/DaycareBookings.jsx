import React, { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus } from '../services/booking';
import './DaycareBookings.css';

const DaycareBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings();
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      setError(`Failed to update booking status.`);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="daycare-bookings-container">
      <h1 className="bookings-header">Current Bookings</h1>
      <div className="booking-list">
        {bookings.map(booking => (
          <div key={booking.id} className={`booking-card ${booking.status.toLowerCase()}`}>
            <div className="booking-details">
              <p><strong>Parent:</strong> {booking.parent.user.full_name}</p>
              <p><strong>Child:</strong> {booking.child_name}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${booking.status.toLowerCase()}`}>{booking.status}</span></p>
            </div>
            {booking.status === 'Pending' && (
              <div className="booking-actions">
                <button onClick={() => handleStatusUpdate(booking.id, 'Accepted')} className="btn-accept">Accept</button>
                <button onClick={() => handleStatusUpdate(booking.id, 'Declined')} className="btn-decline">Decline</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaycareBookings;
