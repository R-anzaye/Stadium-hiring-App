import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ReviewsContext } from "./ReviewsContext";
import { UserContext } from "./UserContext";
import './Home.css'; 
import {server_url} from "../config";


function ReviewForm() {
  const { reviews, addReview, updateReview, deleteReview, fetchRatings } = useContext(ReviewsContext);
  const { currentUser } = useContext(UserContext);
  
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedPitchName, setSelectedPitchName] = useState("");
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
    fetchPitches(); // Fetch pitches when the component mounts
  }, []);

  const fetchPitches = async () => {
    try {
      const response = await fetch(`${server_url}/get_pitches`,{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
      const data = await response.json();
      setPitches(data.pitches);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pitches:', error);
      setLoading(false);
    }
  };

  const handleAddReview = () => {
    if (!comment.trim() || rating < 1 || rating > 5 || !selectedPitchName) {
      toast.error("Please enter comment, rating (1-5), and select a pitch.");
      return;
    }

    const pitch = pitches.find(p => p.name === selectedPitchName); // Find selected pitch
    if (!pitch) {
      toast.error("Pitch information not available.");
      return;
    }

    if (!currentUser || !currentUser.id) {
      toast.error("User information not available.");
      return;
    }

    const newReview = {
      comment: comment.trim(),
      rating: parseInt(rating),
      pitch_id: pitch.id,
      user_id: currentUser.id,
    };

    addReview(newReview);
    resetForm();
  };

  const handleUpdateReview = () => {
    if (!selectedReview || !selectedReview.id) {
      toast.error("No review selected for update.");
      return;
    }

    if (!comment.trim() || rating < 1 || rating > 5) {
      toast.error("Please enter both comment and rating (1-5).");
      return;
    }

    const updatedReview = {
      id: selectedReview.id,
      comment: comment.trim(),
      rating: parseInt(rating),
    };

    updateReview(updatedReview);
    resetForm();
  };

  const handleEditReview = (review) => {
    setSelectedReview(review);
    setEditMode(true);
    setComment(review.comment);
    setRating(review.rating);
    const pitch = pitches.find(p => p.id === review.pitch_id);
    setSelectedPitchName(pitch ? pitch.name : "");
  };

  const handleDelete = (id) => {
    deleteReview(id);
    resetForm();
  };

  const resetForm = () => {
    setComment("");
    setRating(0);
    setSelectedReview(null);
    setEditMode(false);
    setSelectedPitchName("");
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
      <div className="tent">
        <h1>Reviews</h1>
        <p className="par">Check out what others say about our stadiums.</p>
      </div>
    
      <div className="add-review">
        {!editMode && (
          <button onClick={() => setEditMode(!editMode)}>Add Review</button>
        )}
        {editMode && (
          <div>
            {!selectedReview && (
              <select value={selectedPitchName} onChange={(e) => setSelectedPitchName(e.target.value)}>
                <option value="">Select a Pitch</option>
                {pitches && Array.isArray(pitches) && pitches.map(pitch => (
                  <option key={pitch.id} value={pitch.name}>{pitch.name}</option>
                ))}
              </select>
            )}
            <input
              type="text"
              placeholder="Your Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <input
              type="number"
              placeholder="Rating (1-5)"
              value={isNaN(rating) ? "" : rating.toString()}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
            {selectedReview ? (
              <button 
                onClick={handleUpdateReview} 
                disabled={!comment.trim() || rating < 1 || rating > 5}
              >
                Update Review
              </button>
            ) : (
              <button 
                onClick={handleAddReview} 
                disabled={!comment.trim() || rating < 1 || rating > 5 || !selectedPitchName}
              >
                Submit Review
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="container">
        {Array.isArray(reviews) && reviews.map((review, index) => (
          <div key={index} className="review-item">
            {review && review.pitch_name ? (
              <>
                <h3>{review.pitch_name}</h3>
                <p>{review.comment}</p>
                <p>Rating: {review.rating}</p>
                {(currentUser && review.user_id === currentUser.id) && (
                  <>
                    {editMode && selectedReview?.id === review.id ? (
                      <>
                        <button className="btn-update" onClick={handleUpdateReview}>
                          &#10003;
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(selectedReview.id)}>
                        &#10005;
                        </button>
                      </>
                    ) : (
                      <button className="btn-edit" onClick={() => handleEditReview(review)}>
                        &#9998;
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              <p>Review data is incomplete or not loaded yet.</p>
            )}
          </div>
        ))}
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
      <ToastContainer />
    </div>
  );
}

export default ReviewForm;
