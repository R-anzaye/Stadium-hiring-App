import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import BookPitch from './BookPitch';
import ReviewForm from './ReviewForm';
import Pitches from './pitches'
import Admin from './admin'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookpitch" element={<BookPitch />} />
        <Route path="/reviews" element={<ReviewForm />} />
        <Route path="/pitches" element={<Pitches/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </Router>
  );
}

export default App;
