import React, { useEffect, useState } from "react";
import Title from "../../../components/designLayouts/Title";
import SidebarUser from "../../../components/Layout/SidebarUser";
import Breadcrumbs from "../../../components/pageProps/Breadcrumbs";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/auth";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { FaStar } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import ConfirmationModal from "../../../components/designLayouts/ConfirmationModal";
import UpdateReview from "./UpdateReview";
import ImageModal from "../../../components/designLayouts/ImageModal";

const ROWS_PER_PAGE = 4;

const UserReview = () => {
  const [prevLocation, setPrevLocation] = useState("");
  const [auth] = useAuth();
  const [user, setUser] = useState("");
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [reviewDelete, setReviewDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [update, setUpdate] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [products, setProducts] = useState([]);
  const handlePageClick = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    setPage(newPage);
  };

  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleDeleteConfirmation = (review) => {
    setReviewDelete(review);
    setShowDeleteConfirmation(true);
  };

  const [pagination, setPagination] = useState({
    first: 0,
    rows: ROWS_PER_PAGE,
    page: 1,
    pageCount: 0,
    totalRecords: 0,
  });
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (auth.user && auth.user.id) {
          const userId = auth.user.id;
          const { data } = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/review/get-user-reviews/${userId}?page=${page}&limit=${limit}`
          );
          console.log("User Reviews:", data);

          if (data && data.success) {
            setReviews(data.reviews);
            setPagination({
              ...pagination,
              pageCount: Math.ceil(data.total / ROWS_PER_PAGE),
              totalRecords: data.total,
            });
          } else {
            console.error(
              "Error fetching user reviews: Unexpected API response format"
            );
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user reviews:", error);
        setLoading(false);
      }
    };
    fetchReviews();
  }, [auth.user, page, limit]);

  const handleDelete = async (Id) => {
    try {
      const Id = reviewDelete._id;
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/review/delete-review/${Id}`
      );
      if (data.success) {
        toast.success("Xóa đánh giá thành công");
        setShowDeleteConfirmation(false);
        // navigate("/dashboard/admin/users", { state: location?.pathname });
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleProductDetails = (productSlug) => {
    navigate(`/product/${productSlug}`);
  };

  const handleUpdate = (review) => {
    setUpdate(review);
    setShowUpdate(true);
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      <Title title={"Đánh giá sản phẩm - JEANO Store"} />
      <SidebarUser />
      <div className="flex flex-col space-y-6 py-1 px-2 w-full md:w-4/5">
        <div>
          <Breadcrumbs title="Đánh giá sản phẩm" prevLocation={prevLocation} />
        </div>
        <div className="w-full flex flex-col md:flex-row md:flex-wrap justify-center items-center mx-2 px-2">
          {loading ? (
            <p>Đang tải đánh giá...</p>
          ) : reviews.length === 0 ? (
            <div className="justify-center items-center grow p-5 border rounded">
              <div className="flex text-sm font-bold">
                <p>Bạn chưa có đánh giá nào.</p>
              </div>
            </div>
          ) : (
            <div className="justify-center items-center grow p-5 border rounded">
              {reviews.map((review) => (
                <div className="flex justify-center">
                  <div className="w-full h-auto">
                    <article className="shadow-md rounded-md m-3 p-5">
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
                              {dayjs(review.updatedAt).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </time>
                          </p>
                        </div>
                      </div>
                      <div className="w-full flex items-center mb-1 space-x-1 rtl:space-x-reverse">
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
                      {review.orders.map((order) => (
                        <div
                          className="flex justify-between w-full"
                          key={order.order}
                        >
                          {order.products.map((product) => (
                            <div
                              className="flex flex-end items-end"
                              key={product._id}
                            >
                              <div
                                className="underline"
                                onClick={() =>
                                  handleProductDetails(product.slug)
                                }
                              >
                                Xem sản phẩm
                              </div>
                              <div
                                className="mx-5 underline"
                                onClick={() => handleUpdate(review)}
                              >
                                Chỉnh sửa
                              </div>
                              <div
                                onClick={() => handleDeleteConfirmation(review)}
                                className="text-red-500 underline"
                              >
                                Xóa đánh giá
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </article>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showUpdate && (
          <UpdateReview
            reviewId={update._id}
            onCancel={() => {
              setShowUpdate(false);
            }}
          />
        )}

        {showDeleteConfirmation && (
          <ConfirmationModal
            message={`Bạn có chắc chắn muốn xóa đánh giá này không ?`}
            onConfirm={() => handleDelete(reviewDelete._id)}
            onCancel={() => setShowDeleteConfirmation(false)}
          />
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
  ];
  const charCodeSum = username
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorIndex = charCodeSum % colors.length;
  return colors[colorIndex];
};

export default UserReview;
