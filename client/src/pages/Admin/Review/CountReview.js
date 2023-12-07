import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CountReview = ({ onFilterChange }) => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(null);

  const handleAllReviews = () => {
    setFilter(null);
    onFilterChange(null);
  };

  const handleGoodReviews = () => {
    setFilter("good");
    onFilterChange("good");
  };

  const handleBadReviews = () => {
    setFilter("bad");
    onFilterChange("bad");
  };

  const fetchReviews = async () => {
    try {
      let url = `${process.env.REACT_APP_API}/api/v1/review/get-all-reviews`;

      if (filter === "good") {
        url += "?minStar=4&maxStar=5";
      } else if (filter === "bad") {
        url += "?maxStar=3";
      }

      const { data } = await axios.get(url);

      if (data && data.success) {
        setReviews(data.reviews);
      } else {
        console.error(
          "Error fetching user reviews: Unexpected API response format"
        );
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]); // Fetch reviews when the filter changes

  return (
    <div className="flex flex-col md:flex-row gap-2 justify-center items-center text-center">
      <div className="flex-1 md:w-1/3 bg-primeColor hover:bg-black text-white group rounded-md p-5 ring-1 ring-slate-200 shadow-sm">
        <div
          className={`btn ${filter === null ? "active" : ""}`}
          onClick={handleAllReviews}
        >
          <p className="group-hover:text-white font-bold text-lg text-white">
            Tất cả đánh giá
          </p>
          <p className="group-hover:text-white">{reviews.length} đánh giá</p>
        </div>
      </div>

      <div className="flex-1 md:w-1/3 mx-3 bg-primeColor hover:bg-black text-white group rounded-md p-5 ring-1 ring-slate-200 shadow-sm">
        <div
          className={`btn ${filter === "good" ? "active" : ""}`}
          onClick={handleGoodReviews}
        >
          <p className="group-hover:text-white font-bold text-lg text-white">
            Đánh giá tốt
          </p>
          <p className="group-hover:text-white">
            {
              reviews.filter((review) => review.star >= 4 && review.star <= 5)
                .length
            }{" "}
            đánh giá
          </p>
        </div>
      </div>

      <div className="flex-1 md:w-1/3 bg-primeColor hover:bg-black text-white group rounded-md p-5 ring-1 ring-slate-200 shadow-sm">
        <div
          className={`btn ${filter === "bad" ? "active" : ""}`}
          onClick={handleBadReviews}
        >
          <p className="group-hover:text-white font-bold text-lg text-white">
            Đánh giá xấu
          </p>
          <p className="group-hover:text-white">
            {reviews.filter((review) => review.star < 4).length} đánh giá
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountReview;
