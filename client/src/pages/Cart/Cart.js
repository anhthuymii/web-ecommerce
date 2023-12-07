import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";
import { useAuth } from "../../context/auth";
import Title from "../../components/designLayouts/Title";
const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const [totalAmt, setTotalAmt] = useState("");
  const navigate = useNavigate();
  const [shippingCharge, setShippingCharge] = useState("");
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    let price = 0;
    products.map((item) => {
      price += item.price * item.quantity;
      return price;
    });
    setTotalAmt(price);
  }, [products]);

  useEffect(() => {
    let shippingCharge = 0;
    if (totalAmt < 500000) {
      shippingCharge = 30000;
    } else if (totalAmt >= 500000 && totalAmt < 1000000) {
      shippingCharge = 25000;
    } else {
      shippingCharge = 20000;
    }
    setShippingCharge(shippingCharge);
  }, [totalAmt]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const order = useSelector((state) => state.order);
  console.log("order", order);

  const handleCheckout = () => {
    if (auth.user) {
      navigate("/checkout");
    } else {
      navigate("/signin", { state: { redirectTo: "/checkout" } });
    }
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Title title={"Giỏ hàng của bạn - JEANO Store"} />
      <Breadcrumbs title="GIỎ HÀNG" />
      {products.length > 0 ? (
        <div className="pb-20">
          <div className="w-full uppercase h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Sản Phẩm</h2>
            <h2>Giá </h2>
            <h2>Số lượng </h2>
            <h2>Tổng cộng</h2>
          </div>
          <div className="mt-5">
            {products.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>

          <button
            onClick={() => dispatch(resetCart())}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover-bg-red-700 duration-300"
          >
            Xóa hết giỏ hàng
          </button>

          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 uppercase flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">hóa đơn</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Tạm tính
                  <span className="font-semibold tracking-wide font-titleFont">
                    {formatCurrency(totalAmt)}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  phí vận chuyển
                  <span className="font-semibold tracking-wide font-titleFont">
                    {formatCurrency(shippingCharge)}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-bold">
                  Tổng cộng
                  <span className="font-bold tracking-wide text-lg font-titleFont">
                    {formatCurrency(totalAmt + shippingCharge)}
                  </span>
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleCheckout}
                  className="w-full px-2 uppercase h-10 bg-primeColor text-white hover-bg-black duration-300"
                >
                  Thanh Toán
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Giỏ hàng đang rỗng
            </h1>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover-bg-black active-bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover-text-white duration-300">
                Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
