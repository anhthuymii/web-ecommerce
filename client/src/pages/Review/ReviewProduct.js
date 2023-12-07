import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
import ReactPaginate from "react-paginate";
import ImageModal from "../../components/designLayouts/ImageModal";
const ROWS_PER_PAGE = 3;

const ReviewProduct = () => {
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState({});
  const params = useParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [showImageReviews, setShowImageReviews] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [pagination, setPagination] = useState({
    first: 0,
    rows: ROWS_PER_PAGE,
    page: 1,
    pageCount: 0,
    totalRecords: 0,
  });
  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };
  useEffect(() => {
    if (location?.state?.product) {
      setProduct(location.state.product);
      getReviews(location.state.product._id, page);
    } else if (params?.slug) {
      getProduct();
    }
  }, [page, location.state?.product, params?.slug]);

  const handlePageClick = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    setPage(newPage);
  };

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      console.log("Product Data:", data);

      setProduct(data?.product);
      getReviews(data?.product._id, page);
    } catch (error) {
      console.log(error);
    }
  };

  const getReviews = async (productId) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/review/get-product-reviews/${productId}?page=${page}&limit=${limit}`
      );
      console.log("Product Data:", data);

      const { success, reviews, message } = data;

      if (success) {
        setReviews(reviews);
        setPagination({
          ...pagination,
          pageCount: Math.ceil(data.total / ROWS_PER_PAGE),
          totalRecords: data.total,
        });
        setLoading(false);
      } else {
        console.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (value) => {
    setShowImageReviews(value);
  };

  useEffect(() => {
    if (location?.state?.product) {
      setProduct(location.state.product);
      getReviews(location.state.product._id); 
    } else if (params?.slug) {
      getProduct();
    }
  }, [page, location.state?.product, params?.slug]);

  const filteredReviews =
    filterType === "all"
      ? reviews
      : reviews.filter(
          (review) =>
            (filterType === "withImage" && review.reviewPhoto.length > 0) ||
            (filterType === "withoutImage" && review.reviewPhoto.length === 0)
        );
  return (
    <div className="w-full p-4 mx-auto border-b-[1px] my-5 bg-gray-100 border-b-gray-300">
      <h3 className="font-titleFont uppercase text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
        Đánh giá sản phẩm - {product?.name} ({pagination.totalRecords})
      </h3>
      <div className="flex items-center space-x-4 mb-4">
        <span>Lọc đánh giá:</span>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">Tất cả đánh giá</option>
          <option value="withImage">Đánh giá có ảnh</option>
          <option value="withoutImage">Đánh giá không có ảnh</option>
        </select>
      </div>
      {loading ? (
        <p>Đang tải đánh giá...</p>
      ) : filteredReviews.length === 0 ? (
        <div className="justify-center items-center grow p-5 border rounded">
          <div className="flex text-sm font-bold">
            <p>Không có đánh giá nào phù hợp với bộ lọc.</p>
          </div>
        </div>
      ) : (
        <div>
          {filteredReviews.map((review) => (
            <div className="flex justify-center">
              <div className="w-full h-auto">
                <article className="bg-white m-3 p-5">
                  <div key={review._id} className="flex items-center mb-2">
                    {review.user.name && (
                      <div
                        className="rounded-full shadow-md dark:shadow-black/30"
                        style={{
                          backgroundColor: getRandomColor(review.user.name),
                          width: "48px",
                          height: "48px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "#ffffff",
                        }}
                      >
                        {review.user.name[0].toUpperCase()}
                      </div>
                    )}
                    <div className="font-medium mx-5 dark:text-white">
                      <p className="uppercase font-semibold text-titleFont">
                        {review.user.name}
                        <time
                          dateTime="2014-08-16 19:00"
                          className="block text-sm text-gray-500 dark:text-gray-400"
                        >
                          {dayjs(review.updatedAt).format("DD/MM/YYYY HH:mm")}
                        </time>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                    <h3 className="ms-2 text-sm font-semibold text-gray-900 dark:text-white mr-3">
                      {review.orders.map((order) => (
                        <div key={order.order}>
                          {order.products.map((product) => (
                            <div key={product._id}>
                              <p className="uppercase">
                                {product.name} x{product.quantity} | Size:{" "}
                                {product.size}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </h3>
                    {[...Array(review.star)].map((_, index) => (
                      <svg
                        key={index}
                        className="w-4 h-4 mx-10 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                    {[...Array(5 - review.star)].map((_, index) => (
                      <svg
                        key={index}
                        className="w-4 h-4 mx-10 text-gray-300 dark:text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                    <h3 className="ms-2 text-sm font-semibold text-gray-900 dark:text-white">
                      {review.star}
                    </h3>
                  </div>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    {review.comment}
                  </p>
                  {review.reviewPhoto.length > 0 && (
                    <div
                      onClick={() =>
                        handleImageClick(
                          `${process.env.REACT_APP_API}/api/v1/review/photo-review/${review._id}`
                        )
                      }
                    >
                      <img
                        className="w-20 h-20 md:w-34 md:h-34 border rounded-md object-cover"
                        src={`${process.env.REACT_APP_API}/api/v1/review/photo-review/${review._id}`}
                        alt={review.name}
                      />
                    </div>
                  )}
                </article>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          pageCount={pagination.pageCount}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center items-center text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
          pageLinkClassName="w-9 justify-center items-center h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="m-4"
          previousLabel="<"
          nextLabel=">"
        />
        <ImageModal
          isOpen={modalIsOpen}
          imageUrl={modalImageUrl}
          onRequestClose={handleCloseModal}
        />
      </div>
    </div>
  );
};
const getRandomColor = (username) => {
  const colors = [
    "rgba(54, 162, 235, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 40, 192, 1)",
  ];
  const charCodeSum = username
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorIndex = charCodeSum % colors.length;
  return colors[colorIndex];
};

export default ReviewProduct;
