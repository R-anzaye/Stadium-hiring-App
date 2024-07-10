import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import { TaskProvider } from './TaskContext';
import { ReviewsProvider } from './ReviewsContext';
import { AppProvider } from './AppContext';

import Home from './Home';
import BookPitch from './BookPitch';
import ReviewForm from './ReviewForm';
import Admin from './admin';

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
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </AppProvider>
          </ReviewsProvider>
        </TaskProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
