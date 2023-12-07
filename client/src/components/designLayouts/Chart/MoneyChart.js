import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
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
import toast from "react-hot-toast";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const MoneyChart = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([]);
  const [selectedStatistic, setSelectedStatistic] = useState("dailyRevenue");
  const [selectedDate, setSelectedDate] = useState("");
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrderCount, setTodayOrderCount] = useState(0);
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
        console.error("Error fetching orders: Unexpected API response format");
        toast.error("Error fetching orders");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);

  useEffect(() => {
    calculateTodayData();
  }, [orders]);

  const calculateTodayData = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter(
      (order) =>
        order.orderStatus === "Đã giao hàng" &&
        new Date(order.receivedDate).toISOString().split("T")[0] === today
    );

    const todayRevenue = todayOrders.reduce((acc, order) => {
      return (
        acc +
        order.products.reduce((orderAcc, product) => {
          const quantity = parseInt(product.quantity, 10);
          const price = parseFloat(product.price);
          return orderAcc + quantity * price;
        }, 0)
      );
    }, 0);

    setTodayRevenue(todayRevenue);
    setTodayOrderCount(todayOrders.length);
  };

  const fetchOrdersByDate = async (date) => {
    try {
      const formattedDate = date ? new Date(date).toISOString() : "";

      let apiUrl = `${process.env.REACT_APP_API}/api/v1/order/get-orders?receivedDate=${formattedDate}`;
      const response = await axios.get(apiUrl);
      const { data } = response;

      if (data && data.orders) {
        const filteredOrders = data.orders.filter(
          (order) => order.orderStatus === "Đã giao hàng"
        );

        setOrders(filteredOrders);
        console.log("Orders for date:", date, filteredOrders);
      } else {
        console.error("Error fetching orders: Unexpected API response format");
        toast.error("Error fetching orders");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const formattedDate = selectedDate
      ? new Date(selectedDate).toISOString().split("T")[0]
      : "";
    setSelectedDate(selectedDate);
    fetchOrdersByDate(formattedDate);

    setIsDateSelected(Boolean(selectedDate));
  };

  const renderDateSelector = () => {
    const uniqueDates = [
      ...new Set(
        orders.map(
          (order) => new Date(order.receivedDate).toISOString().split("T")[0]
        )
      ),
    ];
    const sortedDates = uniqueDates.sort((a, b) => new Date(a) - new Date(b));

    return (
      <div>
        <select
          id="dateSelector"
          className=" bg-gray-100 border-black rounded-sm p-3"
          onChange={handleDateChange}
          value={selectedDate}
        >
          <option value="">Tất cả</option>
          {sortedDates.map((date) => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderTopProductsChart = () => {
    const topProductRevenue = calculateProductRevenue();
    return <TopProductsChart topProductRevenue={topProductRevenue} />;
  };
  const renderDailyRevenueChart = () => {
    const dailyRevenueChart = getChartData();
    return (
      <Line
        className="w-full md:w-1/2 h-60 md:h-80"
        options={options}
        data={dailyRevenueChart}
      />
    );
  };

  const calculateProductRevenue = () => {
    const productRevenue = {};

    orders.forEach((order) => {
      order.products.forEach((product) => {
        const productName = product.name;
        const quantity = parseInt(product.quantity, 10);
        const price = parseFloat(product.price);

        if (!productRevenue[productName]) {
          productRevenue[productName] = 0;
        }

        productRevenue[productName] += quantity * price;
      });
    });

    const productsArray = Object.keys(productRevenue).map((productName) => ({
      name: productName,
      revenue: productRevenue[productName],
    }));
    const sortedProducts = productsArray.sort((a, b) => b.revenue - a.revenue);
    const topProducts = sortedProducts.slice(0, 10);
    const topProductRevenue = topProducts.reduce((acc, product) => {
      acc[product.name] = product.revenue;
      return acc;
    }, {});

    return topProductRevenue;
  };

  const calculateDailyRevenue = () => {
    const dailyRevenue = {};

    orders.forEach((order) => {
      if (order.orderStatus === "Đã giao hàng") {
        const orderDate = new Date(order.receivedDate)
          .toISOString()
          .split("T")[0];
        const orderAmount = order.products.reduce((acc, product) => {
          const quantity = parseInt(product.quantity, 10);
          const price = parseFloat(product.price);
          acc += quantity * price;
          return acc;
        }, 0);

        if (!dailyRevenue[orderDate]) {
          dailyRevenue[orderDate] = 0;
        }

        dailyRevenue[orderDate] += orderAmount;
      }
    });

    return dailyRevenue;
  };

  const getChartData = () => {
    const dailyRevenueData = calculateDailyRevenue();
    const dates = Object.keys(dailyRevenueData).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    const formattedDates = dates.map((date) => {
      const formattedDate = new Date(date);
      const day = formattedDate.getDate();
      const month = formattedDate.getMonth() + 1;
      const year = formattedDate.getFullYear();
      return `${day}/${month}/${year}`;
    });

    const dailyRevenueChart = {
      labels: formattedDates,
      datasets: [
        {
          label: "Tổng doanh thu",
          data: dates.map((date) => dailyRevenueData[date]),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    return dailyRevenueChart;
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tổng doanh thu tất cả các ngày",
      },
    },
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label htmlFor="statisticSelector" className="mr-2">
          Chọn thống kê:
        </label>
        <select
          id="statisticSelector"
          className=" bg-gray-100 border-black rounded-sm p-3"
          onChange={(e) => setSelectedStatistic(e.target.value)}
          value={selectedStatistic}
        >
          <option value="dailyRevenue">Tổng doanh thu</option>
          <option value="topProducts">Doanh thu sản phẩm</option>
        </select>
      </div>

      {selectedStatistic === "topProducts" && renderDateSelector()}

      {/*selectedStatistic === "dailyRevenue" && renderDayStatisticSelector()*/}

      {selectedStatistic === "topProducts" && renderTopProductsChart()}

      {selectedStatistic === "dailyRevenue" && renderDailyRevenueChart()}
    </div>
  );
};

const TopProductsChart = ({ topProductRevenue }) => {
  const productNames = Object.keys(topProductRevenue);

  const chartData = {
    labels: productNames,
    datasets: [
      {
        label: "Doanh thu",
        data: productNames.map((productName) => topProductRevenue[productName]),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Thống kê Doanh thu theo Sản phẩm",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default MoneyChart;
