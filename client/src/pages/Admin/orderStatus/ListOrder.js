import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineChevronRight } from "react-icons/hi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const ListOrder = ({ onChangeOrderStatus }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [delivery, setDelivery] = useState([]);
  const [unconfirm, setUnconfirm] = useState([]);
  const [confirm, setConfirm] = useState([]);
  const [done, setDone] = useState([]);
  const [cancel, setCancel] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API}/api/v1/order/get-orders`),
        ]);
        setLoading(false);
        const orderData = data.data.orders;
        const delivery = orderData.filter(
          (order) => order.orderStatus === "Đang giao hàng"
        );
        const unconfirm = orderData.filter(
          (order) => order.orderStatus === "Chờ xác nhận"
        );
        const confirm = orderData.filter(
          (order) => order.orderStatus === "Đã xác nhận"
        );
        const done = orderData.filter(
          (order) => order.orderStatus === "Đã giao hàng"
        );
        const cancel = orderData.filter(
          (order) => order.orderStatus === "Đã hủy đơn"
        );
        setOrders(orderData);
        setDelivery(delivery);
        setUnconfirm(unconfirm);
        setConfirm(confirm);
        setDone(done);
        setCancel(cancel);
      } catch (error) {
        console.error("Có lỗi xảy ra:", error);
        toast.error("Có lỗi xảy ra");
      }
    };

    fetchData();
  }, []);

  const handleStatusClick = (status) => {
    setActiveStatus(status);
    navigate(`/dashboard/admin/orders/${status}`);
  };
  const getStatusClass = (status) => {
    return activeStatus === status || (status === "all" && activeStatus === "")
      ? "underline"
      : "";
  };
  return (
    <div className="w-full flex flex-row flex-wrap bg-black text-white justify-center items-center mx-2 px-2">
      <NavLink
        to="/dashboard/admin/orders"
        className={`p-2 m-2 ${getStatusClass("all")}`}
        onClick={() => handleStatusClick("all")}
      >
        Tất cả đơn hàng ({orders.length})
      </NavLink>
      |
      <NavLink
        to="/dashboard/admin/orders/unconfirm"
        className={`p-2 m-2 ${getStatusClass("unconfirm")}`}
        onClick={() => handleStatusClick("unconfirm")}
      >
        Chờ xác nhận ({unconfirm.length})
      </NavLink>
      <HiOutlineChevronRight />
      <NavLink
        to="/dashboard/admin/orders/confirm"
        className={`p-2 m-2 ${getStatusClass("confirm")}`}
        onClick={() => handleStatusClick("confirm")}
      >
        Đã xác nhận ({confirm.length})
      </NavLink>
      <HiOutlineChevronRight />
      <NavLink
        to="/dashboard/admin/orders/delivery"
        className={`p-2 m-2 ${getStatusClass("delivery")}`}
        onClick={() => handleStatusClick("delivery")}
      >
        Đang giao hàng ({delivery.length})
      </NavLink>
      <HiOutlineChevronRight />
      <NavLink
        to="/dashboard/admin/orders/done"
        className={`p-2 m-2 ${getStatusClass("done")}`}
        onClick={() => handleStatusClick("done")}
      >
        Đã giao hàng ({done.length})
      </NavLink>
      |
      <NavLink
        to="/dashboard/admin/orders/cancel"
        className={`p-2 m-2 ${getStatusClass("cancel")}`}
        onClick={() => handleStatusClick("cancel")}
      >
        Đã hủy đơn ({cancel.length})
      </NavLink>
      {/*|
      <button
        className="p-2 m-2"
        // onClick={() => handleDelivery()}
      >
  Đã trả hàng
      </button>*/}
    </div>
  );
};

export default ListOrder;
