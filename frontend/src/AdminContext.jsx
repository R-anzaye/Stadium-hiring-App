import React, { createContext, useContext, useState } from 'react';

export const AdminContext = createContext();

export const useAdminContext = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [pitches, setPitches] = useState([]);

  // Function to fetch all pitches
  const fetchPitches = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/get_pitches', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch pitches');
      }
      const data = await response.json();
      setPitches(data.pitches); 
    } catch (error) {
      console.error('Error fetching pitches:', error.message);
    }
  };

  // Function to add a new pitch
  const addPitch = async (pitchData) => {
    try {
      const response = await fetch('http://127.0.0.1:5555/pitches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(pitchData),
      });
      if (!response.ok) {
        throw new Error('Failed to add pitch');
      }
      const data = await response.json();
      setPitches([...pitches, data]); 
    } catch (error) {
      console.error('Error adding pitch:', error.message);
    }
  };

  // Function to delete a pitch by ID
  const deletePitch = async (pitchId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/pitches/${pitchId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete pitch');
      }
      setPitches(pitches.filter((pitch) => pitch.id !== pitchId));
    } catch (error) {
      console.error('Error deleting pitch:', error.message);
    }
  };

  // Function to update a pitch
  const updatePitch = async (pitchId, updatedData) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/pitches/${pitchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Failed to update pitch');
      }
      const updatedPitch = await response.json();
      setPitches(pitches.map((pitch) => (pitch.id === pitchId ? updatedPitch : pitch)));
    } catch (error) {
      console.error('Error updating pitch:', error.message);
    }
  };

  const adminContextValue = {
    pitches,
    fetchPitches,
    addPitch,
    deletePitch,
    updatePitch,
  };

  return (
    <AdminContext.Provider value={adminContextValue}>
      {children}
    </AdminContext.Provider>
  );
};
