import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext'; // Import UserProvider from UserContext
import Home from './Home';
import BookPitch from './BookPitch';
import ReviewForm from './ReviewForm';
import Pitches from './pitches';
import Admin from './admin';
import { TaskProvider } from './TaskContext';
import { ReviewsProvider } from './ReviewsContext';


function App() {
  return (
    <Router>
    <UserProvider>
     <TaskProvider>
      <ReviewsProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookpitch" element={<BookPitch />} />
          <Route path="/reviews" element={<ReviewForm />} />
          <Route path="/pitches" element={<Pitches />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        </ReviewsProvider>
     </TaskProvider> 
    </UserProvider>
    </Router>
  );
}

export default App;
