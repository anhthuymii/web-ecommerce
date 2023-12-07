import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../../context/auth";
import toast from "react-hot-toast";
import useCategory from "../../../hooks/useCategory";
import Search from "../Search/Search";
import axios from "axios";

const HeaderBottom = () => {
  const [auth, setAuth] = useAuth();
  const [user, setUser] = useState("");
  const navigate = useNavigate;
  const products = useSelector((state) => state.orebiReducer.products);
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const ref = useRef();
  const categories = useCategory();
  const [addressDetails, setAddressDetails] = useState({});

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [show, ref]);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Đăng xuất thành công");
    navigate("/");
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
          if (userData.address) {
            const { city, commune, detail, district } = userData.address;

            setAddressDetails({
              city,
              commune,
              detail,
              district,
            });

            console.log(userData.address);
          }
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [auth.user]);

  return (
    <div className="w-full bg-[#000000] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          <div
            onClick={() => setShow(!show)}
            ref={ref}
            className="flex h-14 cursor-pointer items-center gap-1 text-white"
          >
            <HiOutlineMenuAlt4 className="w-5 h-5" />
            <p className="text-[14px] font-bold">DANH MỤC SẢN PHẨM</p>

            {show && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute m-10 top-6 left-0 z-50 bg-primeColor w-50 text-[#767676] h-auto p-4 pb-6"
              >
                <li className="text-white px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  <Link to={"/shop"}>TẤT CẢ SẢN PHẨM</Link>
                </li>
                {categories?.map((c) => (
                  <li
                    key={c._id}
                    className="text-white px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer"
                  >
                    <Link to={`/category/${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
          {<Search />}
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            {!auth.user ? (
              <div onClick={() => setShowUser(!showUser)} className="flex">
                <FaUser className="text-white text-2xl" />
                <FaCaretDown className="text-white text-2xl" />
                {showUser && (
                  <motion.ul
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-10 right-3 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
                  >
                    <Link to="/signin">
                      <li className="text-white px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Đăng Nhập
                      </li>
                    </Link>
                    <Link onClick={() => setShowUser(false)} to="/signup">
                      <li className="text-white px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover.text-white duration-300 cursor-pointer">
                        Đăng Ký
                      </li>
                    </Link>
                  </motion.ul>
                )}
              </div>
            ) : (
              <div onClick={() => setShowUser(!showUser)} className="flex">
                <div className="text-white uppercase text-lg font-extrabold">
                  {user.name}
                </div>
                <FaCaretDown className="text-white text-2xl" />
                {showUser && (
                  <motion.ul
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
                  >
                    <Link
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user/profile"
                      }`}
                    >
                      <li className="text-white px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                        Trang Cá Nhân
                      </li>
                    </Link>
                    <Link onClick={handleLogout} to="/signin">
                      <li className="text-white px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover.text-white duration-300 cursor-pointer">
                        Đăng Xuất
                      </li>
                    </Link>
                  </motion.ul>
                )}
              </div>
            )}

            <Link to="/cart">
              <div className="relative">
                <FaShoppingCart className="text-white text-2xl" />
                <span className="absolute font-titleFont top-4 -right-2 text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full bg-white text-black">
                  {products.length > 0 ? products.length : 0}
                </span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
