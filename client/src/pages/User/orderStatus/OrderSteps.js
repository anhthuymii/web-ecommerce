import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineChevronRight } from "react-icons/hi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth";

const OrderSteps = ({ onChangeOrderStatus }) => {
  const [auth] = useAuth();
  const [userId, setUserId] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [delivery, setDelivery] = useState([]);
  const [unconfirm, setUnconfirm] = useState([]);
  const [confirm, setConfirm] = useState([]);
  const [done, setDone] = useState([]);
  const [cancel, setCancel] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [status, setStatus] = useState([]);

  useEffect(() => {
    if (auth.user) {
      const { id } = auth.user;
      console.log("User ID:", id);
      setUserId(id);
    }
  }, [auth.user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiUrl = `${process.env.REACT_APP_API}/api/v1/order/get-user-order/${userId}`;
        if (status.length > 0) {
          apiUrl += apiUrl.includes("?")
            ? `&orderStatus=${status}`
            : `?orderStatus=${status}`;
        }
        const response = await axios.get(apiUrl);
        const data = response.data;

        console.log("API URL:", apiUrl);
        console.log("Response Data:", data);

        if (!data || !data.orders) {
          throw new Error("Invalid response format");
        }

        const orderData = data.orders || [];
        console.log("order", orderData);
        // Update state based on order status
        const delivery = orderData.filter(
          (order) => order.orderStatus === "Đang giao hàng"
        );
        setDelivery(delivery);

        const unconfirm = orderData.filter(
          (order) => order.orderStatus === "Chờ xác nhận"
        );
        setUnconfirm(unconfirm);

        const confirm = orderData.filter(
          (order) => order.orderStatus === "Đã xác nhận"
        );
        setConfirm(confirm);

        const done = orderData.filter(
          (order) => order.orderStatus === "Đã giao hàng"
        );
        setDone(done);

        const cancel = orderData.filter(
          (order) => order.orderStatus === "Đã hủy đơn"
        );
        setCancel(cancel);
        setOrders(orderData);
      } catch (error) {
        // console.error("Có lỗi xảy ra:", error.message);
        // toast.error("Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, status]);

  const handleStatusClick = (status) => {
    setActiveStatus(status);
    navigate(`/dashboard/user/orders/${status}`);
  };

  const getStatusClass = (status) => {
    return activeStatus === status || (status === "all" && activeStatus === "")
      ? "underline"
      : "";
  };

  return (
    <div className="w-full flex flex-row flex-wrap bg-black text-white justify-center items-center mx-2 px-2">
      <NavLink
        to="/dashboard/user/orders"
        className={`p-2 m-2 ${getStatusClass("all")}`}
        onClick={() => handleStatusClick("all")}
      >
        Tất cả đơn hàng ({orders.length})
      </NavLink>
      |
      <NavLink
        to="/dashboard/user/orders/unconfirm"
        className={`p-2 m-2 ${getStatusClass("unconfirm")}`}
        onClick={() => handleStatusClick("unconfirm")}
      >
        Chờ xác nhận ({unconfirm.length})
      </NavLink>
      <HiOutlineChevronRight />
      <NavLink
        to="/dashboard/user/orders/confirm"
        className={`p-2 m-2 ${getStatusClass("confirm")}`}
        onClick={() => handleStatusClick("confirm")}
      >
        Đã xác nhận ({confirm.length})
      </NavLink>
      <HiOutlineChevronRight />
      <NavLink
        to="/dashboard/user/orders/delivery"
        className={`p-2 m-2 ${getStatusClass("delivery")}`}
        onClick={() => handleStatusClick("delivery")}
      >
        Đang giao hàng ({delivery.length})
      </NavLink>
      <HiOutlineChevronRight />
      <NavLink
        to="/dashboard/user/orders/done"
        className={`p-2 m-2 ${getStatusClass("done")}`}
        onClick={() => handleStatusClick("done")}
      >
        Đã giao hàng ({done.length})
      </NavLink>
      |
      <NavLink
        to="/dashboard/user/orders/cancel"
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

export default OrderSteps;
