import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const addBooking = (newBooking) => {
    setBookings([...bookings, newBooking]);
  };

  const updateBooking = (updatedBooking) => {
    setBookings(bookings.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)));
  };

  const deleteBooking = (bookingId) => {
    setBookings(bookings.filter((booking) => booking.id !== bookingId));
  };

  const contextValue = {
    bookings,
    loading,
    addBooking,
    updateBooking,
    deleteBooking,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
