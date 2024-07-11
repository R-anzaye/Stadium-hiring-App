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
import BookForm from './BookForm';

function App() {
  return (
    <Router>
      <UserProvider>
        <TaskProvider>
          <ReviewsProvider>
            <AppProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bookpitch" element={<BookPitch />} />
                <Route path="/reviews" element={<ReviewForm />} />
                <Route path="/book/:id" element={<BookForm/>} />
                <Route path="/admin" element={<Admin />} />
           
                <Route path="/admin" element={<Navigate to="/" replace />} />
              </Routes>
            </AppProvider>
          </ReviewsProvider>
        </TaskProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
