import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import { useAuth } from "../../context/auth";
import { AiOutlineProject } from "react-icons/ai";
import { PiUserListBold } from "react-icons/pi";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { FaShippingFast } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import numeral from "numeral";
import Chart from "../../components/designLayouts/Chart/Chart";
import ProductChart from "../../components/designLayouts/Chart/ProductChart";
import { useNavigate } from "react-router-dom";
import MoneyChart from "../../components/designLayouts/Chart/MoneyChart";
import Title from "../../components/designLayouts/Title";
const AdminDashboard = ({ onTotalOrders }) => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [prevLocation, setPrevLocation] = useState("");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [addressDetails, setAddressDetails] = useState({});
  const [user, setUser] = useState("");
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrderCount, setTodayOrderCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);

  useEffect(() => {
    calculateTodayData();
  }, [orders]);

  const calculateTodayData = () => {
    const today = dayjs().format("YYYY-MM-DD"); // Format today's date

    const todayOrders = orders.filter(
      (order) =>
        order.orderStatus === "Đã giao hàng" &&
        dayjs(order.receivedDate).format("YYYY-MM-DD") === today
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

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/auth/users?page={page}&limit={limit}`
        );
        setUsers(data.users);

        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Có lỗi xảy ra");
      }
    };

    fetchTotalUsers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todayOrdersResponse, productsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API}/api/v1/order/get-orders`),
          axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`),
        ]);
        setOrders(todayOrdersResponse.data.orders);
        setLoading(false);

        const productsData = productsResponse.data.products;
        console.log("All products: ", productsData);

        const activeProducts = productsData.filter(
          (product) => product.tag !== "SOLDOUT" && product.quantity > 0
        );
        console.log("Active products: ", activeProducts);

        setProducts(activeProducts);
        setActiveProducts(activeProducts);

        calculateTodayData();
      } catch (error) {
        console.error("Có lỗi xảy ra:", error);
        toast.error("Có lỗi xảy ra");
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    calculateTodayData();
  }, [orders]);

  const getUser = async () => {
    try {
      const userId = auth?.user?.id;
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/user/${userId}`
      );
      console.log("user: ", userId);
      const userData = response.data.user;

      const { city, commune, detail, district } = userData.address;

      setAddressDetails({
        city,
        commune,
        detail,
        district,
      });
      console.log(userData.address);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (auth.user?.id) {
      getUser();
    }
  }, [auth.user?.id]);

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Title title={"Thống kê - JEANO Store"} />
      <Sidebar />
      <div className="flex flex-col space-y-6 py-1 px-2">
        <div>
          <Breadcrumbs title="Thống kê" prevLocation={prevLocation} />
        </div>
        <div className="relative w-full rounded xl:w-12/12 px-1">
          <p className="text-xl font-black uppercase text-center mb-3">
            Thông kê ngày {dayjs().format("DD-MM-YYYY")}
          </p>
          <div className="lg:flex lg:w-full lg:space-x-8 justify-center items-center ">
            <div className="flex flex-col md:flex-row gap-2 text-center">
              <div className="bg-primeColor hover:bg-black text-white group rounded-md p-5 ring-1 ring-slate-200 shadow-sm">
                <div
                  onClick={() => navigate("/dashboard/admin")}
                  className="grid sm:block lg:grid xl:block items-center"
                >
                  <p className="group-hover:text-white font-bold text-lg text-white">
                    Tổng doanh thu
                  </p>
                  <p className="group-hover:text-white">
                    {numeral(todayRevenue).format("0,0")} VNĐ
                  </p>
                </div>
              </div>
              <div className=" bg-primeColor hover:bg-black text-white group rounded-md p-5 ring-1 ring-slate-200 shadow-sm">
                <div
                  onClick={() => navigate("/dashboard/admin/orders")}
                  className="grid sm:block lg:grid xl:block items-center"
                >
                  <p className="group-hover:text-white font-bold text-lg text-white">
                    Số lượng đơn hàng
                  </p>
                  <p className="group-hover:text-white">
                    {todayOrderCount} đơn hàng
                  </p>
                </div>
              </div>
              <div className=" bg-primeColor hover:bg-black text-white group rounded-md p-5 ring-1 ring-slate-200 shadow-sm">
                <div
                  onClick={() => navigate("/dashboard/admin/users")}
                  className="grid sm:block lg:grid xl:block items-center"
                >
                  <p className="group-hover:text-white font-bold text-lg text-white">
                    Số lượng khách hàng
                  </p>
                  <p className="group-hover:text-white">
                    {users.length} khách hàng
                  </p>
                </div>
              </div>
              <div className=" bg-primeColor hover:bg-black text-white group rounded-md p-5 ring-1 ring-slate-200 shadow-sm">
                <div
                  onClick={() => navigate("/dashboard/admin/products")}
                  className="grid sm:block lg:grid xl:block items-center"
                >
                  <p className="group-hover:text-white font-bold text-lg text-white">
                    Sản phẩm đang bán
                  </p>
                  <p className="group-hover:text-white">
                    {activeProducts.length} sản phẩm
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Chart products={products} />
          <MoneyChart />
          <ProductChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
