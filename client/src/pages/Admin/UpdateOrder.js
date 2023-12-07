import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { Menu } from "@headlessui/react";
import { AiOutlineDown } from "react-icons/ai";
import numeral from "numeral";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { MdOutlineCreate } from "react-icons/md";
import ModalUpdate from "./modalUpdate";
import ListOrder from "./orderStatus/ListOrder";
import ReactToPrint from "react-to-print";
import Title from "../../components/designLayouts/Title";

const UpdateOrder = () => {
  const [prevLocation, setPrevLocation] = useState("");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [update, setUpdate] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const { id } = useParams();
  const componentRef = useRef();
  const getOrderDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/order/get-order/${id}`
      );
      setOrders(data.order);
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, [id]);

  const handleUpdate = (order) => {
    setUpdate(order); // Set the order, not the update state
    setShowUpdate(true);
  };

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Title title={"Cập nhật đơn hàng - JEANO Store"} />
      <Sidebar />
      <div className="flex flex-col space-y-6 py-1 px-2">
        <Breadcrumbs title="Chi tiết đơn hàng" prevLocation={prevLocation} />
        <div>
          <ListOrder />
        </div>

        <div ref={componentRef}>
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
                            {orders.address.detail &&
                              ` ${orders.address.detail}`}
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
                      <p className="flex my-4 flex-row text-base leading-4 text-left text-gray-800">
                        Trạng thái: {orders.orderStatus}
                        <MdOutlineCreate
                          className="mx-2 mb-3"
                          size={25}
                          onClick={() => handleUpdate(orders)}
                        />
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
                        className="border-b mt-4 flex flex-col md:flex-row justify-start items-start md:items-center w-full"
                      >
                        <div className="pb-2 md:pb-4 w-full md:w-40">
                          <img
                            className="w-36 h-36 hidden md:block"
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product.product}`}
                            alt={product.name}
                          />
                        </div>
                        <div className=" border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-4 space-y-4 md:space-y-0 md:ml-4">
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
                {showUpdate && (
                  <ModalUpdate
                    order={update} // Pass the order to the modal
                    onCancel={() => setShowUpdate(false)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <ReactToPrint
          trigger={() => {
            return (
              <button className="mx-5 bg-primeColor w-[92px] h-[35px] text-white flex justify-center items-center text-sm font-semibold hover:bg-black duration-300 cursor-pointer">
                In đơn hàng
              </button>
            );
          }}
          content={() => componentRef.current}
          documentTitle={"Chi tiết đơn hàng"}
          pageStyle="print"
        />
      </div>
    </div>
  );
};

export default UpdateOrder;
