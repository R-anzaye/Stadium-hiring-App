import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext';
import { TaskProvider } from './TaskContext';
import { ReviewsProvider } from './ReviewsContext';
import { AppProvider } from './AppContext';
import Home from './Home';
import BookPitch from './BookPitch';
import ReviewForm from './ReviewForm';
import Admin from './admin';
import ProtectedRoute from './ProtectedRoute';
import { AdminProvider } from './AdminContext'
import Pitches from './Pitches';
import AdminBookings from './AdminBookings';

function App() {
  return (
    <Router>
      <UserProvider>
        <AdminProvider>
        <TaskProvider>
          <ReviewsProvider>
            <AppProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bookpitch" element={<BookPitch />} />
                <Route path="/reviews" element={<ReviewForm />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/pitches" element={<Pitches />} />
                <Route path="/bookings" element={<AdminBookings />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute admin>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </AppProvider>
          </ReviewsProvider>
        </TaskProvider>
        </AdminProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
