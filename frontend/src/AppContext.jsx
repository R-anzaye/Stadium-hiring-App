import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [pitches, setPitches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
 

  
  useEffect(() => {
    fetchPitches();
    fetchBookings();
  }, []);

  const fetchPitches = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/get_pitches');
      const data = await response.json();
      setPitches(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pitches:', error);
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/get_bookings', {
        method:'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      ('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const addBooking = async (newBooking) => {
    try {
      const response = await fetch('http://127.0.0.1:5555/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newBooking),
      });
      const data = await response.json();
      setBookings((prevBookings) => [...prevBookings, data]);
    } catch (error) {
      console.error('Error adding booking:', error);
    }
  };

  return (
    <AppContext.Provider value={{ pitches, bookings, loading, addBooking }}>
      {children}
    </AppContext.Provider>
  );
};
