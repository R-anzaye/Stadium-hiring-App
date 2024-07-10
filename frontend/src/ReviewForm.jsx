import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReviewsContext from "./ReviewsContext";

function ReviewForm() {
  const { reviews, addReview, updateReview, deleteReview, fetchRatings } = useContext(ReviewsContext);
  const [newReview, setNewReview] = useState("");
  const [editReview, setEditReview] = useState(null);

  useEffect(() => {
    fetchRatings(); // Fetch ratings when component mounts
  }, []);

  const handleAddReview = () => {
    if (newReview.trim() === "") {
      toast.error("Review cannot be empty");
      return;
    }

    const review = {
      id: Date.now(),
      text: newReview,
    };

    addReview(review);
    setNewReview("");
    toast.success("Review added successfully");
  };

  const handleUpdateReview = () => {
    if (newReview.trim() === "") {
      toast.error("Review cannot be empty");
      return;
    }

    const updatedReview = {
      ...editReview,
      text: newReview,
    };

    updateReview(updatedReview);
    setEditReview(null);
    setNewReview("");
    toast.success("Review updated successfully");
  };

  const handleEditClick = (review) => {
    setEditReview(review);
    setNewReview(review.text);
  };

  const handleDeleteClick = (id) => {
    deleteReview(id);
    toast.success("Review deleted successfully");
  };

  return (
    <div id="main">
      <div className="navbar">
        <div className="icon">
          <h2 className="logo">PresentSpotter</h2>
        </div>
        <div className="menu">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/bookpitch">BookPitch</Link>
            </li>
            <li>
              <Link to="/reviews">Reviews</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="tent">
        <h1>Reviews</h1>
        <p className="par">Check out what others say about our stadiums.</p>
      </div>
      <div className="search">
        <input className="srch" type="search" placeholder="Search" />
      </div>
      <div className="container">
        <input
          type="text"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write a review"
        />
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <p>{review.text}</p>
              <button onClick={() => handleEditClick(review)}>Edit</button>
              <button onClick={() => handleDeleteClick(review.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <footer>
        <p>PresentSpotter</p>
        <p>
          For more information, contact us at info@presentspotter.co.ke or follow us
          on our social media platforms at pitch.ke
        </p>
        <div className="social">
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="#">
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
        <div className="copy">
          <p>&copy; 2024 PresentSpotter. All Rights Reserved</p>
        </div>
      </footer>
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default ReviewForm;
