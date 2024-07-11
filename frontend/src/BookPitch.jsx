import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {server_url} from "../config";


function Bookings() {
  const { bookings, loading, addBooking, updateBooking, deleteBooking } = useContext(AppContext);
  const [pitches, setPitches] = useState([]);
  const [loadingPitches, setLoadingPitches] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formState, setFormState] = useState({ pitch_id: '', date: '' });

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const response = await fetch(`${server_url}/get_pitches`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPitches(data.pitches);
      setLoadingPitches(false);
    } catch (error) {
      console.error('Error fetching pitches:', error);
      setLoadingPitches(false);
    }
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingBooking) {
      try {
        const response = await fetch(`${server_url}/bookings/${editingBookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formState),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        updateBooking(data);
        toast.success('Booking updated successfully');
      } catch (error) {
        console.error('Error updating booking:', error);
        toast.error('Failed to update booking');
      }
    } else {
      try {
        const response = await fetch(`${server_url}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formState),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        addBooking(data);
        toast.success('Booking created successfully');
      } catch (error) {
        console.error('Error creating booking:', error);
        toast.error('Failed to create booking');
      }
    }
    setFormState({ pitch_id: '', date: '' });
    setEditingBooking(null);
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`${server_url}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      deleteBooking(bookingId);
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setFormState({ pitch_id: booking.pitch_id, date: new Date(booking.date).toISOString().slice(0, 16) });
  };

  return (
    <div id="main">
      <div className="navbar">
        <div className="icon">
          <h2 className="logo">PresentSpotter</h2>
        </div>
        <div className="menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/bookpitch">BookPitch</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
          </ul>
        </div>
      </div>

      <div>
        {loading ? (
          <p></p>
        ) : (
          <ul>
            {bookings && Array.isArray(bookings) && bookings.map((booking) => (
              <li key={booking.id}>
                Pitch ID: {booking.pitch_id}, Date: {new Date(booking.date).toLocaleString()}
                <button onClick={() => handleDeleteBooking(booking.id)}>Cancel</button>
                <button onClick={() => handleEditBooking(booking)}>Edit</button>
              </li>
            ))}
          </ul>
        )}

        <h2>{editingBooking ? 'Edit Booking' : 'Create Booking'}</h2>
        <form className="add-review"onSubmit={handleSubmit}>
          <label>
            Pitch ID:
            <select name="pitch_id" value={formState.pitch_id} onChange={handleChange} required>
              <option value="" disabled>Select Pitch</option>
              {pitches.map((pitch) => (
                <option key={pitch.id} value={pitch.id}>{pitch.name}</option>
              ))}
            </select>
          </label>
          <label>
            Date:
            <input type="datetime-local" name="date" value={formState.date} onChange={handleChange} required />
          </label>
          <button type="submit">{editingBooking ? 'Update' : 'Book'}</button>
        </form>

        <h2>Pitches</h2>
        <div className="card-container">
          {loadingPitches ? (
            <p>Loading pitches...</p>
          ) : (
            pitches.map((pitch) => (
              <div key={pitch.id} className="card">
                <img  alt={pitch.name} />
                <h3>{pitch.name}</h3>
                <p>{pitch.description}</p>
                <p><span>Price per Hour:</span> ${pitch.price_per_hour}</p>
                <div>
                  {bookings
                    .filter((booking) => booking.pitch_id === pitch.id)
                    .map((booking) => (
                      <div key={booking.id}>
                        <p>Booking Date: {new Date(booking.date).toLocaleString()}</p>
                        <button onClick={() => handleDeleteBooking(booking.id)}>Cancel</button>
                        <button onClick={() => handleEditBooking(booking)}>Edit</button>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>

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
      <ToastContainer />
    </div>
  );
}

export default Bookings;
