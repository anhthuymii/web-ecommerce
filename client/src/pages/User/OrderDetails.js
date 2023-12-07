import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import SidebarUser from "../../components/Layout/SidebarUser";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import OrderSteps from "./orderStatus/OrderSteps";
import dayjs from "dayjs";
import numeral from "numeral";
import Title from "../../components/designLayouts/Title";
import { MdOutlineRateReview, MdOutlineReviews } from "react-icons/md";
import ReviewModal from "./ReviewModal";

const OrderDetails = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [prevLocation, setPrevLocation] = useState("");
  const [timelineData, setTimelineData] = useState([]);
  const [review, setReview] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const [reviewedProductIds, setReviewedProductIds] = useState([]);
  const [productReviews, setProductReviews] = useState({});

  const getOrderDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/order/get-order/${id}`
      );
      setOrders(data.order);
      setTimelineData(data.timeline);
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, [id]);

  const [selectedStatus, setSelectedStatus] = useState("");

  const handleOrderStatusChange = (status) => {
    setSelectedStatus(status);
  };
  const handleReview = (product) => {
    const productId = product.id;

    if (!reviewedProductIds.includes(productId)) {
      setReview(product);
      setShowReview(true);
    } else {
      toast.info("Sản phẩm đã được đánh giá trước đó.");
    }
    console.log("Product to review:", product);
  };

  const handleReviewSubmit = () => {
    const productId = review.id;

    if (!reviewedProductIds.includes(productId)) {
      setReviewedProductIds((prevIds) => [...prevIds, productId]);
      setIsReviewSubmitted(true);
      setProductReviews({
        ...productReviews,
        [productId]: true,
      });
      localStorage.setItem(
        "reviewedProductIds",
        JSON.stringify(reviewedProductIds)
      );
      setShowReview(false);
    } else {
      toast.info("Sản phẩm đã được đánh giá trước đó.");
    }
  };
  useEffect(() => {
    const storedReviewedProductIds =
      JSON.parse(localStorage.getItem("reviewedProductIds")) || [];
    setReviewedProductIds(storedReviewedProductIds);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Title title={"Chi tiết đơn hàng - JEANO Store"} />
      <SidebarUser />
      <div className="flex flex-col space-y-6 py-1 px-2">
        <Breadcrumbs title="Chi tiết đơn hàng" prevLocation={prevLocation} />
        <OrderSteps onChangeOrderStatus={handleOrderStatusChange} />
        {orders && (
          <div className="px-4">
            <div className="bg-gray-50 p-4">
              <h3 className="text-xl my-4 font-semibold leading-5 text-gray-800">
                Mã đơn hàng: {orders.id}
              </h3>
              <hr />
              <div className="flex flex-col w-full">
                <div className="bg-gray-50 p-4 mt-4">
                  <div className="space-y-4">
                    <p className="text-lg font-semibold leading-4 text-gray-800">
                      Thông tin người nhận
                    </p>
                    <p className="text-base leading-4 text-gray-800">
                      Họ và tên: {orders.name}
                    </p>
                    <p className="text-base leading-4 text-gray-800">
                      Địa chỉ:{" "}
                      {orders.address && (
                        <>
                          {orders.address.detail && ` ${orders.address.detail}`}
                          ,
                          {orders.address.commune &&
                            ` ${orders.address.commune},`}
                          {orders.address.district &&
                            ` ${orders.address.district},`}{" "}
                          {orders.address.city}
                        </>
                      )}
                    </p>
                    <p className="text-base leading-4 text-left text-gray-800">
                      Số điện thoại: {orders.phone}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 mt-4">
                  <div className="space-y-4">
                    <p className="text-lg font-semibold leading-4 text-gray-800">
                      Thông tin đơn hàng
                    </p>
                    <p className="text-base leading-4 text-left text-gray-800">
                      Ngày đặt hàng:{" "}
                      {dayjs(orders.createdAt).format("DD/MM/YYYY HH:mm")}
                    </p>
                    <p className="text-base leading-4 text-left text-gray-800">
                      Ngày cập nhật:{" "}
                      {dayjs(orders.updatedAt).format("DD/MM/YYYY HH:mm")}
                    </p>
                    <p className="text-base leading-4 text-left text-gray-800">
                      Thanh toán: {orders.paymentIntent}
                    </p>
                    <p className="text-base leading-4 text-left text-gray-800">
                      Trạng thái: {orders.orderStatus}
                    </p>
                    {orders.orderStatus === "Đã hủy đơn" && (
                      <span className="mx-2 mb-3">
                        - Lý do hủy: {orders.cancelReason}
                      </span>
                    )}
                    <p className="text-base leading-4 text-left text-gray-800">
                      Ngày gửi hàng:{" "}
                      {dayjs(orders.sendDate).format("DD/MM/YYYY")}
                    </p>
                    <p className="text-base leading-4 text-left text-gray-800">
                      Ngày nhận hàng (dự kiến):{" "}
                      {dayjs(orders.receivedDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 mt-4">
              <div className="space-y-4">
                <p className="text-base md:text-xl font-semibold leading-6 text-gray-800">
                  Tất cả sản phẩm
                </p>
                {orders.products &&
                  orders.products.map((product) => (
                    <div
                      key={product.id}
                      className="mt-4 flex flex-col md:flex-row justify-start items-start md:items-center w-full"
                    >
                      <div className="pb-2 md:pb-4 w-full md:w-40">
                        <img
                          className="w-36 h-36 hidden md:block"
                          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product.product}`}
                          alt={product.name}
                        />
                      </div>
                      <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-4 space-y-4 md:space-y-0 md:ml-4">
                        <div className="w-full flex flex-col justify-start items-start space-y-2">
                          <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                            {product.name}
                          </h3>
                          <div className="flex justify-start items-start flex-col space-y-2">
                            <p className="text-sm leading-none text-gray-800">
                              Size: {product.size}
                            </p>
                            <p className="text-sm leading-none text-gray-800">
                              Số lượng: {product.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between space-x-8 items-start w-full">
                          <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                            Giá: {numeral(product.price).format("0,0")} VND
                          </p>
                        </div>
                      </div>
                      {orders.orderStatus === "Đã giao hàng" && (
                        <div>
                          <p
                            onClick={() => handleReview(product)}
                            className="flex my-4 underline flex-row text-base leading-4 text-left text-gray-800 cursor-pointer"
                          >
                            {reviewedProductIds.includes(product.id) ? (
                              <div>
                                <MdOutlineReviews
                                  className="mx-2 mb-3"
                                  size={25}
                                />
                                <Link
                                  to="/dashboard/user/reviews"
                                  className="text-base leading-4 text-left"
                                >
                                  Đã đánh giá sản phẩm
                                </Link>
                              </div>
                            ) : (
                              <div>
                                <MdOutlineRateReview
                                  className="mx-2 mb-3"
                                  size={25}
                                />
                                <p className="text-base leading-4 text-left">
                                  Đánh giá sản phẩm
                                </p>
                              </div>
                            )}
                          </p>

                          {/*reviewedProductIds.includes(product.id) && (
                            <p
                              onClick={() => handleReview(product)}
                              className="text-base leading-4 text-left text-green-600 cursor-pointer"
                            >
                              Xem đánh giá sản phẩm
                            </p>
                          )*/}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold leading-5 text-gray-800">
                  Thanh toán
                </h3>
                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 pb-4">
                  <div className="flex justify-between w-full">
                    <p className="text-base leading-4 text-gray-800">
                      Tạm tính:
                    </p>
                    <p className="text-base leading-4 text-gray-600">
                      {numeral(orders.itemsPrice).format("0,0")} VND
                    </p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base leading-4 text-gray-800">
                      Phí vận chuyển:
                    </p>
                    <p className="text-base leading-4 text-gray-600">
                      {numeral(orders.shippingPrice).format("0,0")} VND
                    </p>
                  </div>
                  <hr className="w-full" />
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base font-semibold leading-4 text-gray-800">
                      Tổng cộng:
                    </p>
                    <p className="text-base font-semibold leading-4">
                      {numeral(orders.totalPrice).format("0,0")} VND
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showReview && (
          <ReviewModal
            orderId={orders.id}
            product={review}
            onCancel={() => setShowReview(false)}
            onReviewSubmit={handleReviewSubmit}
            isReviewed={reviewedProductIds.includes(review.id)}
          />
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
