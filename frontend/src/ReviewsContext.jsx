import React, { createContext, useState } from "react";

const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  const addReview = (review) => {
    setReviews([...reviews, review]);
  };

  const updateReview = (updatedReview) => {
    setReviews(
      reviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      )
    );
  };

  const deleteReview = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  return (
    <ReviewsContext.Provider
      value={{ reviews, addReview, updateReview, deleteReview }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export default ReviewsContext;