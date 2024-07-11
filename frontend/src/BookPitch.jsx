import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import './Home.css'; // Import your CSS file
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Bookings() {
  const { bookings, loading, addBooking } = useContext(AppContext);
  const [pitches, setPitches] = useState([]);
  const [loadingPitches, setLoadingPitches] = useState(true);

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/get_pitches', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setPitches(data.pitches); // Update state with pitches from backend response
      setLoadingPitches(false);
    } catch (error) {
      console.error('Error fetching pitches:', error);
      setLoadingPitches(false);
    }
  };

  const handleAddBooking = async (newBooking) => {
    try {
      const response = await fetch('http://127.0.0.1:5555/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newBooking),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      addBooking(data); // Update bookings context with newly added booking
    } catch (error) {
      console.error('Error adding booking:', error);
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
          <li><Link to="/">Home</Link></li>
          <li><Link to="/bookpitch">BookPitch</Link></li>
          <li><Link to="/reviews">Reviews</Link></li>
        </ul>
      </div>
    </div>

    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {bookings && Array.isArray(bookings) && bookings.map((booking) => (
            <li key={booking.id}>
               Pitch ID: {booking.pitch_id}, Date: {new Date(booking.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
      <h2>Pitches</h2>
      <div className="card-container">
        {loadingPitches ? (
          <p>Loading pitches...</p>
        ) : (
          pitches.map((pitch) => (
            <div key={pitch.id} className="card">
              <img src={`data:image/jpeg;base64,${pitch.image}`} alt={pitch.name} />
              <h3>{pitch.name}</h3>
              <p>{pitch.description}</p>
              <p><span>Price per Hour:</span> ${pitch.price_per_hour}</p>
              <Link to={`/book/${pitch.id}`}>Book</Link>
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
