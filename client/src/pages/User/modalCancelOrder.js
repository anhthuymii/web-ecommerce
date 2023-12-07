import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const ModalCancelOrder = ({ order, onCancel }) => {
  const navigate = useNavigate();
  const [cancellationReason, setCancellationReason] = useState("");
  const [changeStatus, setChangeStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  if (!order) {
    return null;
  }
   const cancelOrder = async (orderId, cancelReason) => {
    try {
      if (!cancelReason) {
        setErrorMessage("Vui lòng nhập lý do hủy đơn hàng.");
        return;
      }
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/order/cancel-order/${orderId}`,
        {
          orderStatus: "Đã hủy đơn",
          cancelReason,
        }
      );

      if (data.success) {
        toast.success("Đã hủy đơn hàng thành công");
        navigate("/dashboard/user/orders/cancel");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-black bg-opacity-30 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-5 rounded relative m-5">
          <AiOutlineClose
            className="absolute top-3 right-5"
            onClick={onCancel}
          />
          <h2 className="text-center uppercase text-lg font-bold tracking-tight text-gray-900 ">
            Hủy đơn hàng
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setErrorMessage("");
              cancelOrder(order._id, cancellationReason);
            }}
            className="mx-auto max-w-xl sm:mt-5"
          >
            <div className="w-full mb-5 p-1">
              <p className="text-sm font-titleFont font-semibold my-2">
                Lý do hủy đơn hàng
              </p>
              <input
                className="focus:shadow-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                type="text"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Nhập lý do hủy đơn hàng"
              />
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
            </div>
            <div className="mt-5 flex justify-center">
              <button
                type="submit"
                className="w-full md:w-44 bg-primeColor text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:bg-black hover:text-white duration-200"
              >
                Xác nhận hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCancelOrder;
