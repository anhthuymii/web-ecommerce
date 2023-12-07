import React, { useState } from "react";
import Header from "../../components/home/Header/Header";
import HeaderBottom from "../../components/home/Header/HeaderBottom";
import { BsCheckCircleFill } from "react-icons/bs";
import Footer from "../../components/home/Footer/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errNewPassword, setErrNewPassword] = useState("");
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };
  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
    setErrNewPassword("");
  };
  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,
        {
          email,
          newPassword,
        }
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/signin");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }

    if (!email) {
      setErrEmail("Hãy nhập Địa chỉ Email");
    }

    if (!newPassword) {
      setErrNewPassword("Hãy nhập Mật khẩu mới");
    }
  };
  return (
    <>
      <Header />
      <HeaderBottom />
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
          <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
            <div className="flex flex-col gap-1 -mt-1">
              <h1 className="font-titleFont text-xl font-medium">
                Stay sign in for more
              </h1>
              <p className="text-base">When you sign in, you are with us!</p>
            </div>
            <div className="w-[300px] flex items-start gap-3">
              <span className="text-green-500 mt-1">
                <BsCheckCircleFill />
              </span>
              <p className="text-base text-gray-300">
                <span className="text-white font-semibold font-titleFont">
                  Get started fast with JEANO STORE
                </span>
                <br />
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab
                omnis nisi dolor recusandae consectetur!
              </p>
            </div>
            <div className="w-[300px] flex items-start gap-3">
              <span className="text-green-500 mt-1">
                <BsCheckCircleFill />
              </span>
              <p className="text-base text-gray-300">
                <span className="text-white font-semibold font-titleFont">
                  Access all JEANO services
                </span>
                <br />
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab
              </p>
            </div>
            <div className="w-[300px] flex items-start gap-3">
              <span className="text-green-500 mt-1">
                <BsCheckCircleFill />
              </span>
              <p className="text-base text-gray-300">
                <span className="text-white font-semibold font-titleFont">
                  Trusted by online Shoppers
                </span>
                <br />
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lgl:w-1/2 h-full">
          <form className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
                Khôi Phục Mật Khẩu
              </h1>
              <div className="flex flex-col gap-3">
                {/* Email */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Nhập lại Email
                  </p>
                  <input
                    onChange={handleEmail}
                    value={email}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="email"
                    placeholder="Nhập Địa chỉ Email"
                  />
                  {errEmail && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errEmail}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Nhập mật khẩu mới
                  </p>
                  <input
                    onChange={handleNewPassword}
                    value={newPassword}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="Nhập lại Mật khẩu"
                  />
                  {errNewPassword && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errNewPassword}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  className="bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md  duration-300"
                >
                  Đặt Lại Mật khẩu
                </button>
                <p className="text-sm text-center font-titleFont font-medium">
                  Bạn chưa có tài khoản ?{" "}
                  <Link to="/signup">
                    <span className="hover:text-blue-600 duration-300 underline">
                      Đăng Ký
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
