import axios from "axios";
import React from "react";
import { url } from "../../redux/slides/api";

const PayButton = ({ products, user }) => {
  const handleCheckout = () => {
    console.log("products:", products);
    console.log("user:", user);

    axios
      .post(`${url}/stripe/create-checkout-session`, {
        products,
        user: user,
      })
      .then((res) => {
        if (res.data.url) {
          window.location.href = res.data.url;
        }
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <>
      <label className="flex items-center gap-2">
        <input
          onClick={() => handleCheckout()}
          type="radio"
          value="stripe"
          name="paymentMethod"
          className="form-checkbox accent-black md:accent-black text-primeColor"
        />
        Thanh toán Stripe
      </label>
      {/*<button
        className="w-full mx-2 uppercase h-10 bg-primeColor text-white hover-bg-black duration-300"
        onClick={() => handleCheckout()}
      >
        Thanh toán bằng Stripe
  </button>*/}
    </>
  );
};

export default PayButton;
