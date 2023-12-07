import React, { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import Header from "../../components/home/Header/Header";
import HeaderBottom from "../../components/home/Header/HeaderBottom";
import Footer from "../../components/home/Footer/Footer";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../redux/slides/userSlice";
import Title from "../../components/designLayouts/Title";
import Image from "../../components/designLayouts/Image";
import img from "../../assets/images/banner/cate1.jpg";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const handleEmail = (e) => {
    const inputValue = e.target.value.slice(0, 20);
    setEmail(inputValue);
    setErrEmail("");
    if (!EmailValidation(inputValue)) {
      setErrEmail("Email không hợp lệ");
    }
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  useEffect(() => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
    const savedAuth = JSON.parse(localStorage.getItem("auth"));

    if (savedAuth && savedAuth.token) {
      setAuth({
        user: savedAuth.user,
        token: savedAuth.token,
      });
    }
  }, [setAuth]);
  const dispatch = useDispatch();

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrEmail("Vui lòng nhập Email");
    } else {
      if (!EmailValidation(email)) {
        setErrEmail("Vui lòng nhập Email");
      }
    }

    if (!password) {
      setErrPassword("Vui lòng nhập Mật khẩu");
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/signin`,
        {
          email,
          password,
        }
      );
      if (res && res.data.success) {
        toast.success(res.data.message);
        setAuth({
          user: res.data.user,
          token: res.data.token,
        });
        dispatch(setUser(res.data.user));
        dispatch(setToken(res.data.token));
        localStorage.setItem("auth", JSON.stringify(res.data));

        const redirectTo = location.state?.redirectTo || "/";
        navigate(redirectTo);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <>
      <Header />
      <HeaderBottom />
      <div className="w-full h-screen flex items-center justify-center">
        <Title title={"Đăng nhập - JEANO Store"} />
        <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
          <div className="w-[500px] h-full flex flex-col gap-6 justify-center">
            <Image
              className="h-full w-full object-cover bg-black p-10"
              imgSrc={img}
            />
          </div>
        </div>
        <div className="w-full lgl:w-1/2 h-full">
          {successMsg ? (
            <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
              <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
                {successMsg}
              </p>
              <Link to="/signup">
                <button
                  className="w-full h-10 bg-primeColor text-gray-200 rounded-md text-base font-titleFont font-semibold 
            tracking-wide hover:bg-black hover:text-white duration-300"
                >
                  Đăng Ký
                </button>
              </Link>
            </div>
          ) : (
            <form className="w-full lgl:w-[400px] h-screen flex items-center justify-center">
              <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
                <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
                  Đăng Nhập
                </h1>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-.5">
                    <p className="font-titleFont text-base font-semibold text-gray-600">
                      Email
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
                  <div className="flex flex-col gap-.5">
                    <p className="font-titleFont text-base font-semibold text-gray-600">
                      Mật khẩu
                    </p>
                    <input
                      onChange={handlePassword}
                      value={password}
                      className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                      type="password"
                      placeholder="Nhập Mật khẩu"
                    />
                    {errPassword && (
                      <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                        <span className="font-bold italic mr-1">!</span>
                        {errPassword}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleSignIn}
                    className="bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md  duration-300"
                  >
                    Đăng Nhập
                  </button>
                  <p className="text-sm text-center font-titleFont font-medium">
                    Bạn chưa có tài khoản ?{" "}
                    <Link to="/signup">
                      <span className="hover:text-blue-600 duration-300 underline">
                        Đăng Ký
                      </span>
                    </Link>
                  </p>
                  <p className="text-sm text-center font-titleFont font-medium">
                    <Link to="/forgot-password">
                      <span className="hover:text-blue-600 duration-300 underline">
                        Quên mật khẩu
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignIn;
