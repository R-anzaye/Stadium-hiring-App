import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {server_url} from "../config";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true); // Set loading state to true
      const response = await fetch(`${server_url}/admin/${bookings}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setBookings(data.bookings);
      setLoading(false); // Set loading state to false after successful fetch
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false); // Set loading state to false in case of error
      toast.error('Failed to fetch bookings. Please try again later.'); // Show error toast notification
    }
  };

  return (
    <div id="main">
      <div className="navbar">
        <div className="icon">
          <h2 className="logo">PresentSpotter</h2>
        </div>
        <div className="menu">
          <ul>
            <li>
              <Link to="/admin">Main</Link>
            </li>
            <li>
              <Link to="/pitches">Pitches</Link>
            </li>
            <li>
              <Link to="/bookings">Bookings</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="admin-bookings">
        <h2>Admin Bookings Page</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="review-ite">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Pitch Name</th>
                <th>User Name</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.pitch_name}</td>
                  <td>{booking.username}</td>
                  <td>{new Date(booking.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <footer>
          <p>PresentSpotter</p>
          <p>
            For more information, contact us at info@presentspotter.co.ke or follow us
            on our social media platforms at pitch.ke
          </p>
          <div className="social">
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-whatsapp"></i></a>
          </div>
          <div className="copy">
            <p>&copy; 2024 PresentSpotter. All Rights Reserved</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AdminBookings;
