import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const ProductChart = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate("");
  const [status, setStatus] = useState([]);

  const fetchOrders = async () => {
    try {
      let apiUrl = `${process.env.REACT_APP_API}/api/v1/order/get-orders`;
      const response = await axios.get(apiUrl);
      const { data } = response;

      if (data && data.orders) {
        const filteredOrders = data.orders.filter(
          (order) => order.orderStatus === "Đã giao hàng"
        );

        setOrders(filteredOrders);
        console.log("Orders:", filteredOrders);
      } else {
        console.error("Có lỗi xảy ra");
        toast.error("Có lỗi xảy ra");
      }
      setLoading(false);
    } catch (error) {
      console.error("Có lỗi xảy ra khi lấy đơn hàng", error);
      toast.error("Có lỗi xảy ra khi lấy đơn hàng");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const calculateProductQuantity = () => {
    const productQuantity = {};

    orders.forEach((order) => {
      order.products.forEach((product) => {
        const productName = product.name;
        const quantity = parseInt(product.quantity, 10);

        if (!productQuantity[productName]) {
          productQuantity[productName] = 0;
        }

        productQuantity[productName] += quantity;
      });
    });

    const productsArray = Object.keys(productQuantity).map((productName) => ({
      name: productName,
      quantity: productQuantity[productName],
    }));
    const sortedProducts = productsArray.sort(
      (a, b) => b.quantity - a.quantity
    );
    const topProducts = sortedProducts.slice(0, 10);
    const topProductQuantity = topProducts.reduce((acc, product) => {
      acc[product.name] = product.quantity;
      return acc;
    }, {});

    return topProductQuantity;
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top 10 sản phẩm bán chạy nhất theo Sản phẩm",
      },
    },
  };
  const topProductQuantity = calculateProductQuantity();
  const productNames = Object.keys(topProductQuantity);

  const data = {
    labels: productNames,
    datasets: [
      {
        label: "Số lượng đã bán",
        data: productNames.map(
          (productName) => topProductQuantity[productName]
        ),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <Line
      className="w-full my-5 md:w-1/2 h-60 md:h-80"
      options={options}
      data={data}
    />
  );
};

export default ProductChart;
