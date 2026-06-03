import React, { useState, useEffect } from "react";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/reviews")
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      });
  }, []);

 const StarInput = () => {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ fontSize: "28px", cursor: "pointer", marginBottom: "10px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            color: star <= (hover || rating) ? "#D4A853" : "#ccc",
            marginRight: "5px",
            transition: "0.2s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

  const submitReview = () => {
    if (rating === 0 || comment.trim() === "") return;

    setSubmitting(true);

    axios
      .post("http://localhost:8080/api/reviews", {
        vleresimi: rating,
        komenti: comment,
      })
      .then((res) => {
        setReviews([res.data, ...reviews]);
        setRating(0);
        setComment("");
      })
      .catch((err) => console.error("Error posting review:", err))
      .finally(() => setSubmitting(false));
  };

  if (loading)
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading reviews...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", fontFamily: "Georgia, serif", marginBottom: "30px" }}>
        Customer Reviews
      </h2>

      {/* REVIEW FORM */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #E6E0D8",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Leave a Review</h3>

        <StarInput />

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            minHeight: "100px",
          }}
        />

        <button
          onClick={submitReview}
          disabled={submitting}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#0D5C5C",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {/* REVIEWS LIST */}
      {reviews.length === 0 ? (
        <p style={{ textAlign: "center" }}>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            style={{
              border: "1px solid #E6E0D8",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          >
            <h4 style={{ marginBottom: "5px" }}>
              {review.klienti ? review.klienti.emri : "Anonymous"}
            </h4>

            <p style={{ color: "#555", fontSize: "14px" }}>
              "{review.komenti}"
            </p>

            {/*  DISPLAY STARS */}
            <div style={{ color: "#D4A853", fontSize: "14px" }}>
              {"★".repeat(review.vleresimi)}
              {"☆".repeat(5 - review.vleresimi)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Reviews;