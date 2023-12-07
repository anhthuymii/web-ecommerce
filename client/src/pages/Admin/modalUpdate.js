import { Menu } from "@headlessui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlineDown } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const ModalUpdate = ({ order, onCancel }) => {
  const [cancellationReason, setCancellationReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [status, setStatus] = useState([
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang giao hàng",
    "Đã giao hàng",
    "Đã hủy đơn",
    "Đã trả hàng",
  ]);

  const [changeStatus, setChangeStatus] = useState("");
  const [sendDate, setSendDate] = useState("");
  const [receivedDate, setReceivedDate] = useState("");

  const updateProductQuantities = async (productsToUpdate) => {
    try {
      await Promise.all(
        productsToUpdate.map(async (productUpdate) => {
          const { productId, newQuantity } = productUpdate;

          try {
            const { data: currentProductData } = await axios.get(
              `${process.env.REACT_APP_API}/api/v1/product/product/${productId}`
            );

            if (currentProductData.success) {
              const updatedQuantity =
                currentProductData.product.quantity - newQuantity;

              const quantityData = new FormData();
              quantityData.append("quantity", updatedQuantity);

              await axios.put(
                `${process.env.REACT_APP_API}/api/v1/product/update-product/${productId}`,
                quantityData
              );

              console.log("Quantity updated successfully");
            } else {
              console.error(
                "Failed to get current product data:",
                currentProductData.message
              );
              toast.error(currentProductData.message);
            }
          } catch (error) {
            console.error("Error updating product quantity:", error);
            toast.error("Error updating product quantity");
          }
        })
      );
    } catch (error) {
      console.error("Error updating product quantities:", error);
      toast.error("Error updating product quantities");
    }
  };

  const handleChange = async (orderId, value) => {
    try {
      console.log("Handling change. Order ID:", orderId, "Value:", value);
      if (
        value === "Đã giao hàng" &&
        new Date(receivedDate) < new Date(sendDate)
      ) {
        toast.error("Ngày nhận hàng không thể nhỏ hơn ngày gửi hàng.");
        return;
      }
      if (value === "Đã giao hàng") {
        const productsToUpdate = order.products.map((product) => ({
          productId: product.product,
          newQuantity: product.quantity,
        }));

        await Promise.all([
          updateProductQuantities(productsToUpdate),
          axios.put(
            `${process.env.REACT_APP_API}/api/v1/order/update-order/${orderId}`,
            {
              orderStatus: value,
              sendDate,
              receivedDate,
              productIds: order.products.map((product) => product.product),
            }
          ),
        ]);

        toast.success(
          "Cập nhật trạng thái đơn hàng và số lượng sản phẩm thành công"
        );
        // window.location.reload();
        onCancel();
      }
      if (order.orderStatus === "Đã giao hàng") {
        toast.error("Không thể chỉnh sửa khi đơn hàng đã giao hàng thành công");
        return;
      }
      if (order.orderStatus === "Đã hủy đơn") {
        toast.error("Không thể chỉnh sửa khi đơn hàng đã bị hủy");
        return;
      }
      if (
        changeStatus !== "Đã hủy đơn" &&
        new Date(receivedDate) < new Date(sendDate)
      ) {
        toast.error("Ngày nhận hàng không thể nhỏ hơn ngày gửi hàng.");
        return;
      }
      else {
        const { data } = await axios.put(
          `${process.env.REACT_APP_API}/api/v1/order/update-order/${orderId}`,
          {
            orderStatus: value,
            sendDate,
            receivedDate,
            productIds: order.products.map((product) => product.product),
          }
        );

        if (data.success) {
          toast.success("Cập nhật trạng thái đơn hàng thành công");
          window.location.reload();
          onCancel();
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Lỗi xử lý thay đổi:", error);
      toast.error("Lỗi xử lý thay đổi");
    }
  };

  useEffect(() => {
    setChangeStatus(order.orderStatus);
    setSendDate(order.sendDate);
    setReceivedDate(order.receivedDate);
    setCancellationReason("");
  }, [order]);

  const cancelOrder = async (orderId, cancelReason) => {
    try {
      if (!cancelReason) {
        toast.error("Vui lòng nhập lý do hủy đơn hàng.");
        return;
      }
      if (order.orderStatus === "Đã giao hàng") {
        toast.error("Không thể chỉnh sửa khi đơn hàng đã giao hàng thành công");
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
        navigate("/dashboard/admin/orders");
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
          <h2 className="text-center text-lg font-bold tracking-tight text-gray-900 ">
            Cập nhật trạng thái đơn hàng
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setErrorMessage("");
              if (changeStatus === "Đã hủy đơn") {
                cancelOrder(order._id, cancellationReason);
              } else {
                handleChange(order._id, changeStatus);
              }
            }}
            action="#"
            method="POST"
            className="mx-auto max-w-xl sm:mt-5"
          >
            <div className="flex flex-col items-center justify-center grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="w-full p-1">
                <p className="text-sm my-2 font-titleFont font-semibold px-2">
                  Trạng thái
                </p>
                <Menu as="div" className="w-50 relative inline-block text-left">
                  {({ open }) => (
                    <>
                      <div>
                        <span className="rounded-md shadow-sm">
                          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover-bg-gray-50">
                            {changeStatus ? changeStatus : "Chọn trạng thái"}
                            <AiOutlineDown
                              className="-mr-1 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </span>
                      </div>

                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {status.map((t) => (
                          <Menu.Item key={t}>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-gray-100" : "bg-white"
                                } block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left`}
                                onClick={() => {
                                  setChangeStatus(t);
                                }}
                              >
                                {t}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </>
                  )}
                </Menu>
              </div>
              <div className="w-full p-1">
                {changeStatus !== "Đã hủy đơn" && (
                  <p className="text-sm font-titleFont font-semibold px-2">
                    Ngày gửi hàng
                  </p>
                )}
                {changeStatus !== "Đã hủy đơn" && (
                  <input
                    className="focus:shadow-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    type="date"
                    value={sendDate}
                    onChange={(e) => setSendDate(e.target.value)}
                    placeholder="Chọn ngày gửi"
                  />
                )}
              </div>
              <div className="w-full p-1">
                {changeStatus !== "Đã hủy đơn" && (
                  <p className="text-sm font-titleFont font-semibold px-2">
                    Ngày nhận hàng (dự kiến)
                  </p>
                )}
                {changeStatus !== "Đã hủy đơn" && (
                  <input
                    className="focus:shadow-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    type="date"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    placeholder="Chọn ngày nhận"
                  />
                )}
              </div>
            </div>
            {changeStatus === "Đã hủy đơn" && (
              <div className="w-full mb-10 p-1">
                <p className="text-sm font-titleFont font-semibold px-2">
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
            )}

            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                className="w-full md:w-44 bg-primeColor text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:bg-black hover:text-white duration-200"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalUpdate;
