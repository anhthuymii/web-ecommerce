import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

import { Doughnut as DoughnutChart, Bar, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Chart = ({ products }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate("");
  const [status, setStatus] = useState([]);
  const [paymentChartData, setPaymentChartData] = useState(null);
  const [orderStatusChartData, setOrderStatusChartData] = useState(null);

  const productOrderCounts = products.reduce((acc, product) => {
    if (Array.isArray(product.orders)) {
      const orderCount = product.orders.reduce(
        (orderAcc, order) => orderAcc + order.quantity,
        0
      );
      acc[product.name] = orderCount;
    } else {
      acc[product.name] = 0;
    }
    return acc;
  }, {});

  console.log("Product Order Counts:", productOrderCounts);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let apiUrl = `${process.env.REACT_APP_API}/api/v1/order/get-orders`;

        const response = await axios.get(apiUrl);
        const { data } = response;

        if (data && data.orders) {
          const filteredOrdersForPayment = data.orders.filter(
            (order) =>
              order.orderStatus === "Đã giao hàng" ||
              order.orderStatus === "Đang giao hàng" ||
              order.orderStatus === "Đã xác nhận"
          );
          const paymentIntentCounts = filteredOrdersForPayment.reduce(
            (acc, order) => {
              const paymentIntent = order.paymentIntent || "Unknown";
              acc[paymentIntent] = (acc[paymentIntent] || 0) + 1;
              return acc;
            },
            {}
          );
          const paymentChartData = {
            labels: Object.keys(paymentIntentCounts),
            datasets: [
              {
                label: "Số lượng",
                data: Object.values(paymentIntentCounts),
                backgroundColor: [
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  // Add more colors as needed
                ],
                borderColor: [
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  // Add more colors as needed
                ],
                borderWidth: 1,
              },
            ],
          };

          setPaymentChartData(paymentChartData);

          // Thống kê theo trạng thái đơn hàng
          const orderStatusCounts = data.orders.reduce((acc, order) => {
            const orderStatus = order.orderStatus || "Unknown";
            acc[orderStatus] = (acc[orderStatus] || 0) + 1;
            return acc;
          }, {});

          const targetOrderStatuses = [
            "Chờ xác nhận",
            "Đã xác nhận",
            "Đang giao hàng",
            "Đã giao hàng",
            "Đã hủy đơn",
          ];

          targetOrderStatuses.forEach((status) => {
            if (!orderStatusCounts.hasOwnProperty(status)) {
              orderStatusCounts[status] = 0;
            }
          });

          const filteredOrderStatusCounts = Object.keys(orderStatusCounts)
            .filter((status) => targetOrderStatuses.includes(status))
            .reduce((acc, status) => {
              acc[status] = orderStatusCounts[status];
              return acc;
            }, {});

          console.log(
            "Filtered Order Status Counts:",
            filteredOrderStatusCounts
          );

          const orderStatusChartData = {
            labels: Object.keys(filteredOrderStatusCounts),
            datasets: [
              {
                label: "Số lượng",
                data: Object.values(filteredOrderStatusCounts),
                backgroundColor: [
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                  "rgba(54, 162, 235, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(255, 99, 132, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(153, 102, 255, 1)",
                  // Add more colors as needed
                ],
                borderWidth: 1,
              },
            ],
          };
          console.log("Order Status Chart Data:", orderStatusChartData);

          setOrderStatusChartData(orderStatusChartData);
        } else {
          console.error(
            "Error fetching orders: Unexpected API response format"
          );
          toast.error("Error fetching orders");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders");
      }
    };

    fetchOrders();
  }, [status]);

  if (!products || !Array.isArray(products)) {
    return <div>Không có dữ liệu thống kê</div>;
  }

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return (
    <div className="flex">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-60 md:h-80 my-10">
          <p className="text base font-bold text-center">
            Thống kê hình thức thanh toán
          </p>
          {paymentChartData && (
            <Pie className="my-2" data={paymentChartData} options={options} />
          )}
        </div>
        <div className="w-full md:w-1/2 h-100 md:h-80 my-10">
          <p className="text base font-bold text-center">
            Thống kê số lượng đơn hàng
          </p>
          {orderStatusChartData && (
            <Pie
              className="flex flex-row my-2"
              data={orderStatusChartData}
              options={options}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chart;
