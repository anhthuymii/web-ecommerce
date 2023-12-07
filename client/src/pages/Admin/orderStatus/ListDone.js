import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import numeral from "numeral";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineCreate, MdOutlineWatchLater } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import OrderSteps from "../../User/orderStatus/OrderSteps";
import Sidebar from "../../../components/Layout/Sidebar";
import Breadcrumbs from "../../../components/pageProps/Breadcrumbs";
import ConfirmationModal from "../../../components/designLayouts/ConfirmationModal";
import ListOrder from "./ListOrder";
import Title from "../../../components/designLayouts/Title";
const ROWS_PER_PAGE = 12;

const ListDone = ({ onTotalOrders }) => {
  const [orders, setOrders] = useState([]);
  const [prevLocation, setPrevLocation] = useState("");
  const [orderDelete, setOrderDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate("");
  const [status, setStatus] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const [pagination, setPagination] = useState({
    first: 0,
    rows: ROWS_PER_PAGE,
    page: 1,
    pageCount: 0,
    totalRecords: 0,
  });

  const handleDeleteConfirmation = (order) => {
    setOrderDelete(order);
    setShowDeleteConfirmation(true);
  };
  const handlePageClick = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    setPage(newPage);
  };

  const fetchOrders = async () => {
    try {
      let apiUrl = `${process.env.REACT_APP_API}/api/v1/order/get-orders?page=${page}&limit=${limit}&orderStatus=Đã%20giao%20hàng`;
      if (status.length > 0) {
        apiUrl += `&orderStatus=${status}`;
      }

      const response = await axios.get(apiUrl);
      const { data } = response;

      console.log("API URL:", apiUrl);

      // const response = await axios.get(apiUrl);
      console.log("API Response:", response);

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
        toast.error("Error fetching orders");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    // Fetch all products when the component mounts
    fetchOrders();
  }, [status, page, limit]);

  const handleDelete = async (Id) => {
    try {
      const Id = orderDelete._id;
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/order/delete-order/${Id}`
      );
      if (data.success) {
        toast.success("Hủy đơn hàng thành công");
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

  const handleViewOrderDetails = (orderId) => {
    navigate(`/dashboard/admin/order/update-order/${orderId}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Title title={"Đơn hàng đã giao - JEANO Store"} />
      <Sidebar />
      <div className="flex flex-col space-y-6 py-1 px-2">
        <div>
          <Breadcrumbs title="Đơn hàng đã giao" prevLocation={prevLocation} />
        </div>
        <div>
          <ListOrder />
        </div>
        {orders.length === 0 ? (
          <p className="text-lg font-bold">Không có đơn hàng đã giao</p>
        ) : (
          <div>
            <div className="flex flex-row w-full rounded xl:w-12/12 px-1">
              <div className="block bg-transparent mx-4 overflow-x-auto">
                {orders.length === 0 ? (
                  <div className="justify-center items-center grow p-5 border rounded">
                    <div className="flex text-sm font-bold">
                      <p>Không có đơn hàng đã giao.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <table className="border-separate border border-slate-400 mt-2 ...">
                      <thead>
                        <tr className="bg-black text-white border">
                          <th className="text-md px-2 md:px-6 py-3">
                            Mã đơn hàng
                          </th>
                          <th className="text-md px-2 md:px-6 py-3">
                            Ngày tạo
                          </th>
                          <th className="text-md px-2 md:px-6 py-3">
                            Trạng thái
                          </th>
                          <th className="text-md px-2 md:px-6 py-3">
                            Tổng cộng
                          </th>
                          <th className="text-md px-2 md:px-6 py-3">
                            Thanh toán
                          </th>
                          <th className="text-md px-2 md:px-6 py-3">
                            Xem chi tiết
                          </th>
                          <th className="text-md px-2 md:px-6 py-3">Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={order._id}>
                            <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                              {order._id}
                            </td>
                            <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                              {dayjs(order.createdAt).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </td>
                            <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                              {order.orderStatus}
                            </td>
                            <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                              {numeral(order.totalPrice).format("0,0")} VNĐ
                            </td>
                            <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                              {order.paymentIntent}
                            </td>
                            <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                              <MdOutlineCreate
                                size={25}
                                onClick={() =>
                                  handleViewOrderDetails(order._id)
                                }
                              />
                            </td>
                            <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                              <AiFillDelete
                                size={25}
                                onClick={() => handleDeleteConfirmation(order)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {showDeleteConfirmation && (
                  <ConfirmationModal
                    message={`Bạn có chắc chắn muốn hủy đơn hàng này không ?`}
                    onConfirm={() => handleDelete(orderDelete._id)}
                    onCancel={() => setShowDeleteConfirmation(false)}
                  />
                )}
              </div>
            </div>
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
  );
};

export default ListDone;
