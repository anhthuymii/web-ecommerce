import { useContext, createContext, useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { RiShoppingCartFill } from "react-icons/ri";
import { BsFillTicketDetailedFill } from "react-icons/bs";
import {
  BiCreditCardAlt,
  BiGridAlt,
  BiHomeAlt,
  BiSolidCategory,
  BiSolidUserAccount,
} from "react-icons/bi";
import { AiFillCaretRight, AiFillCaretLeft } from "react-icons/ai";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { MdOutlineReviews } from "react-icons/md";
const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [auth] = useAuth();
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [user, setUser] = useState("");

  const menu = [
    { name: "Thống kê", icon: <BiHomeAlt />, path: "/dashboard/admin" },
    {
      name: "Quản lý sản phẩm",
      icon: <BiSolidCategory />,
      path: "/dashboard/admin/products",
    },
    {
      name: "Danh mục sản phẩm",
      icon: <BsFillTicketDetailedFill />,
      path: "/dashboard/admin/create-category",
    },

    {
      name: "Quản lý đơn hàng",
      icon: <RiShoppingCartFill />,
      path: "/dashboard/admin/orders",
    },
    {
      name: "Quản lý người dùng",
      icon: <BiSolidUserAccount />,
      path: "/dashboard/admin/users",
    },
    {
      name: "Đánh giá sản phẩm",
      icon: <MdOutlineReviews />,
      path: "/dashboard/admin/reviews",
    },
    {
      name: "Thông tin cá nhân",
      icon: <BiCreditCardAlt />,
      path: "/dashboard/admin/info",
    },
  ];

  const variants = {
    expanded: { width: "20%", minWidth: "200px" }, // Adjust the width as needed
    nonExpanded: { width: "5%", minWidth: "70px" }, // Adjust the width as needed
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (auth.user && auth.user.id) {
          const userId = auth.user.id;
          const response = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/auth/user/${userId}`
          );
          const userData = response.data.user;
          console.log("user: ", userId);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [auth.user]);

  return (
    <motion.div
      animate={isExpanded ? "expanded" : "nonExpanded"}
      variants={variants}
      className={
        "px-4 py-5 mb-2 flex flex-col border border-r-1 w-full h-full relative" +
        (isExpanded ? "px-10" : "px-4")
      }
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-5 h-5 mt-1 ml-2 bg-primeColor text-white rounded-full absolute flex items-center justify-center cursor-pointer"
      >
        {isExpanded ? <AiFillCaretRight /> : <AiFillCaretLeft />}{" "}
      </div>
      <div className="ml-14 text-xl font-bold flex space-x-3 items-center">
        <div className={isExpanded ? "block" : "hidden"}>Hi, {user.name}</div>
      </div>
      <div className="mt-10 flex flex-col space-y-8">
        {menu.map((item, index) => (
          <Link to={item.path} key={index}>
            <div
              className={`flex space-x-3 p-2 rounded ${
                activeNavIndex === index
                  ? "bg-primeColor text-white font-bold"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveNavIndex(index)}
            >
              <div className="mr-5 mt-1">{item.icon}</div>
              <div className={isExpanded ? "block" : "hidden"}>{item.name}</div>
              <div className="mr-5 mt-1">{item.text}</div>
              {!isExpanded && (
                <div
                  className={`bg-gray-200  ${isExpanded ? "w-52 ml-3" : "w-0"}`}
                >
                  {item.text}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <SidebarContext.Provider value={{ isExpanded }}>
        <ul className="flex-1 px-3">{children}</ul>
      </SidebarContext.Provider>
    </motion.div>
  );
}
