import React, { useState, useEffect } from 'react';
import { getBookingHistory } from '../services/booking';
import './DaycareBookingHistory.css';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(<span key={i} className={i <= rating ? 'star-filled' : 'star-empty'}>&#9733;</span>);
  }
  return <div className="star-rating">{stars}</div>;
};

const DaycareBookingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getBookingHistory();
        setHistory(response.data.booking_history);
      } catch (err) {
        setError('Failed to fetch booking history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="daycare-booking-history-container">
      <h1 className="history-header">Booking History</h1>
      <div className="history-list">
        {history.map(booking => (
          <div key={booking.id} className="history-card">
            <div className="history-details">
              <p><strong>Parent:</strong> {booking.parent_name}</p>
              <p><strong>Child:</strong> {booking.child_name}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <div className="rating-section">
                <p><strong>Rating:</strong></p>
                <StarRating rating={booking.rating} />
              </div>
              <p><strong>Review:</strong> {booking.review}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaycareBookingHistory;
