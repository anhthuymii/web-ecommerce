import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import numeral from "numeral";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useAuth } from "../../../context/auth";
import Breadcrumbs from "../../../components/pageProps/Breadcrumbs";
import SidebarUser from "../../../components/Layout/SidebarUser";
import OrderSteps from "./OrderSteps";
import Title from "../../../components/designLayouts/Title";
const ROWS_PER_PAGE = 4;

const OrderDelivery = () => {
  const [auth, setAuth] = useAuth();
  const [userId, setUserId] = useState("");
  // const [id, setId] = useState("");
  const [prevLocation, setPrevLocation] = useState("");
  const [orders, setOrders] = useState([]);
  const [firstProduct, setFirstProduct] = useState(null);
  const navigate = useNavigate();
  const [status, setStatus] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    first: 0,
    rows: ROWS_PER_PAGE,
    page: 1,
    pageCount: 0,
    totalRecords: 0,
  });

  const handlePageClick = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    setPage(newPage);
  };

  useEffect(() => {
    // Extract user ID from the authentication context
    if (auth?.user) {
      const { id } = auth.user;
      console.log("User ID:", id);
      setUserId(id);
    }
  }, [auth?.user]);

  const fetchOrders = async () => {
    try {
      // Use the userId in the API request
      let apiUrl = `${process.env.REACT_APP_API}/api/v1/order/get-user-order/${userId}?orderStatus=Đang%20giao%20hàng`;
      const response = await axios.get(apiUrl);
      const { data } = response;

      console.log("API URL:", apiUrl);

      if (data && data.orders) {
        setOrders(data.orders);
        console.log("Orders:", data.orders);

        setPagination({
          ...pagination,
          pageCount: Math.ceil(data.total / ROWS_PER_PAGE),
          totalRecords: data.total,
        });
      } else {
        console.error("Error fetching orders: Unexpected API response format");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [userId, limit, status, page]);

  const handleViewOrderDetails = (orderId) => {
    navigate(`/dashboard/user/order/${orderId}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      <Title title={"Đơn hàng đang giao - JEANO Store"} />
      <SidebarUser />
      <div className="flex flex-col space-y-6 py-1 px-2 w-full md:w-4/5">
        <div>
          <Breadcrumbs
            title="Đơn hàng đang giao hàng"
            prevLocation={prevLocation}
          />
        </div>
        <div>
          <OrderSteps />
        </div>
        <div className="w-full flex flex-col md:flex-row md:flex-wrap justify-center items-center mx-2 px-2">
          {orders.length === 0 ? (
            <div className="justify-center items-center grow p-5 border rounded">
              <div className="flex text-sm font-bold">
                <p>Bạn chưa có đơn hàng nào.</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col md:flex-row md:flex-wrap justify-center items-center mx-2 px-2">
              {orders.map((order) => (
                <div
                  key={order._id}
                  // onClick={() => handleViewOrderDetails(order._id)}
                  className="w-full flex flex-wrap bg-white p-4 mt-3 shadow-md rounded-md"
                >
                  <div className="flex flex-col">
                    <div className="flex flex-row">
                      <h1 className=" text-base font-semibold mb-2 lg:mb-0 lg:mr-4">
                        {order._id}
                      </h1>
                    </div>
                    <div>
                      <p className="text-base font-semibold">
                        {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                      </p>
                    </div>
                    <div className="flex-col justify-start mt-2">
                      <p>Trạng thái: {order.orderStatus}</p>
                      <p>Thanh toán: {order.paymentIntent}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="w-full text-base mt-2">
                    {order.products[0] && (
                      <>
                        <div className="flex flex-row w-full my-2">
                          <img
                            className="w-20 h-20 md:w-34 md:h-34 border rounded-md object-cover"
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${order.products[0].product?._id}`}
                            alt={order.products[0].name}
                          />
                          <div className="mx-3 uppercase font-bold">
                            {order.products[0].name} x
                            {order.products[0].quantity}
                          </div>
                        </div>
                        <hr className="w-full" />
                        {order.products.length > 1 && (
                          <span className="flex justify-end">
                            +{order.products.length - 1} sản phẩm khác
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <hr className="w-full" />
                  <div className="flex justify-start mt-2">
                    <p className="font-bold">
                      Tổng tiền: {numeral(order.totalPrice).format("0,0")} VNĐ
                    </p>
                  </div>
                  <div className="w-full ">
                    <div className="flex flex-row justify-end">
                      <p
                        className="hover:underline flex justify-end text-base font-semibold"
                        onClick={() => handleViewOrderDetails(order._id)}
                      >
                        Xem chi tiết
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDelivery;
