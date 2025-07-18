import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import '../styles/DaycareBookings.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'react-bootstrap';
import ChildProfileModal from '../components/ChildProfileModal';

const DaycareBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingAPI.getDaycareBookings();
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
      await bookingAPI.updateDaycareBookingStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch {
      setError('Failed to update booking status.');
    }
  };

  const handleCancel = async (bookingId) => {
  const confirmed = window.confirm("Are you sure you want to cancel this booking?");
  if (!confirmed) return;

  try {
    await bookingAPI.cancelBooking(bookingId, "Cancelled by daycare");
    toast.success("Booking cancelled successfully.");
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" } : b)
    );
  } catch (error) {
    console.error("Cancel error", error);
    toast.error("Failed to cancel booking.");
  }
};


  const filteredBookings = bookings.filter((booking) =>
    filter === 'All' ? true : booking.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="daycare-bookings-wrapper">
      <div className="header-container text-center mb-5">
        <h1 className="page-title">Current Bookings</h1>
        <p className="page-subtitle">Manage booking requests and their status</p>
        <Link to="/daycare/dashboard" className="btn btn-outline-primary back-btn mt-3">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="booking-filters mb-4 d-flex flex-wrap justify-content-center gap-2">
        {['All', 'Pending', 'Cancelled', 'Confirmed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`btn filter-btn ${filter === status ? 'active' : ''}`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading && <div className="loading spinner-border text-primary" />}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="booking-list centered-list">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="booking-card profile-info-card">
            <div className="booking-details">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">{booking.child_name}</h5>
                <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                  {booking.status_display || booking.status}
                </span>
              </div>

              <p><strong>Parent:</strong> {booking.parent_profile?.full_name || "N/A"}</p>
              <p><strong>Contact:</strong> {booking.parent_profile?.phone || "N/A"}</p>
              <p><strong>Booking Type:</strong> {booking.booking_type_display}</p>
              <p><strong>Payment Status:</strong> {booking.payment_status}</p>
              <p><strong>Total Amount:</strong> ৳{booking.total_amount}</p>
              <p><strong>Paid:</strong> ৳{booking.paid_amount}</p>
              <p><strong>Remaining:</strong> ৳{booking.remaining_amount}</p>
              <p><strong>Instructions:</strong> {booking.special_instructions || "None"}</p>

              <hr className="my-2" />
              <p><strong>Created At:</strong> {new Date(booking.created_at).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(booking.updated_at).toLocaleString()}</p>
              {booking.confirmed_at && (
                <p><strong>Confirmed At:</strong> {new Date(booking.confirmed_at).toLocaleString()}</p>
              )}
              {booking.cancelled_at && (
                <>
                  <p><strong>Cancelled At:</strong> {new Date(booking.cancelled_at).toLocaleString()}</p>
                  <p><strong>Cancelled By:</strong> {booking.cancelled_by}</p>
                  <p><strong>Reason:</strong> {booking.cancellation_reason || "N/A"}</p>
                </>
              )}
            </div>


            <div className="booking-actions mt-4 d-flex flex-column flex-md-row gap-3">
              {booking.status.toLowerCase() === "pending" && (
                <button
                  onClick={() => handleStatusUpdate(booking.id, "Accepted")}
                  className="btn btn-success flex-fill"
                >
                  Accept
                </button>
              )}

              {["pending"].includes(booking.status.toLowerCase()) && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="btn btn-decline-profile"
                >
                  Cancel Booking
                </button>
              )}

              <button
                className="btn btn-view-child flex-fill"
                onClick={() => setSelectedBooking(booking)}
              >
                View Child Profile
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Use ChildProfileModal instead of the previous Modal */}
      <ChildProfileModal
        show={!!selectedBooking}
        onHide={() => setSelectedBooking(null)}
        booking={selectedBooking}
      />
    </div>
  );
};

export default DaycareBookings;
