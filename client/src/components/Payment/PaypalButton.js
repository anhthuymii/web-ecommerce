import React, { useEffect } from "react";
import {
  PayPalScriptProvider,
  usePayPalScriptReducer,
  PayPalButtons,
} from "@paypal/react-paypal-js";
import { useLoading } from "../../hooks/useLoading";
import { resetCart } from "../../redux/orebiSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { pay } from "../../services/orderService";

const PaypalButton = ({ order }) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AUqSpKCs0Q8zVHRvV0ZGKZQt6uk4GapXUkabiQqEu5G7ZIOZPw5MO0mCMzIDSCV0UuYVXrE59jfH5YSN",
      }}
    >
      <Buttons order={order} />
    </PayPalScriptProvider>
  );
};

const Buttons = ({ order }) => {
  const navigate = useNavigate();
  const [{ isPending }] = usePayPalScriptReducer();
  const { showLoading, hideLoading } = useLoading();
  useEffect(() => {
    isPending ? showLoading() : hideLoading();
  });
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "VND",
            value: order.totalPrice,
          },
        },
      ],
    });
  };
  const onApprove = async (data, actions) => {
    try {
      const payment = await actions.order.capture();
      const orderId = await pay(payment.id);
      resetCart();
      toast.success("Thanh toán thành công", "Thành công");
      navigate(`/track/` + orderId);
    } catch (error) {
      toast.error("Thanh toán thất bại", "Lỗi");
    }
  };
  const onError = (error) => {
    toast.error("Thanh toán lỗi", "Lỗi");
  };
  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
    />
  );
};

export default PaypalButton;
