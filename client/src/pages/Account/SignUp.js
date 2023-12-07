import React, { useRef, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { logoLight } from "../../assets/images";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../../components/home/Header/Header";
import HeaderBottom from "../../components/home/Header/HeaderBottom";
import Footer from "../../components/home/Footer/Footer";
import Title from "../../components/designLayouts/Title";
import Image from "../../components/designLayouts/Image";
import img from "../../assets/images/banner/cate1.jpg";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [checked, setChecked] = useState(false);
  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errAddress, setErrAddress] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const handleName = (e) => {
    const inputValue = e.target.value.slice(0, 15);
    setName(inputValue);
    setErrClientName("");
  };
  const handleEmail = (e) => {
    const inputValue = e.target.value.slice(0, 20);
    setEmail(inputValue);
    setErrEmail("");
    if (!EmailValidation(inputValue)) {
      setErrEmail("Email không hợp lệ");
    }
  };
  const handlePhone = (e) => {
    const inputValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(inputValue);
    setErrPhone("");
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (checked) {
      if (!name) {
        setErrClientName("Vui lòng nhập Họ tên");
      }
      if (!email) {
        setErrEmail("Vui lòng nhập Email");
      } else {
        if (!EmailValidation(email)) {
          setErrEmail("Vui lòng nhập Email");
        }
      }
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;

      if (!password) {
        setErrPassword("Vui lòng nhập Mật khẩu");
      } else if (!password.match(passwordRegex)) {
        let reminder = "Mật khẩu không đáp ứng yêu cầu:";
        if (password.length < 8) {
          reminder += " ít nhất 8 ký tự,";
        }
        if (!/\d/.test(password)) {
          reminder += " ít nhất 1 số,";
        }
        if (!/[a-z]/.test(password)) {
          reminder += " ít nhất 1 chữ thường,";
        }
        if (!/[A-Z]/.test(password)) {
          reminder += " ít nhất 1 chữ hoa,";
        }
        if (!/[@#$%^&+=]/.test(password)) {
          reminder += " ít nhất 1 ký tự đặt biệt,";
        }

        reminder = reminder.replace(/,$/, "");
        setErrPassword(reminder);
      }
      if (!phone) {
        setErrPhone("Vui lòng nhập Số điện thoại");
      }

      if (!address) {
        setErrAddress("Vui lòng nhập Địa chỉ");
      }
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/auth/signup`,
          {
            name,
            email,
            password,
            phone,
            // address,
          }
        );
        if (res && res.data.success) {
          toast.success(res.data.message);
          navigate(`/signin`);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Có lỗi xảy ra");
      }
    } else {
      toast.error(
        "Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư của JEANO STORE."
      );
    }
  };
  return (
    <>
      <Header />
      <HeaderBottom />
      <div className="w-full h-screen flex items-center justify-start">
        <Title title={"Đăng ký - JEANO Store"} />
        <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
          <div className="w-[500px] h-full flex flex-col gap-6 justify-center">
            <Image
              className="h-full w-full object-cover bg-black p-10"
              imgSrc={img}
            />
          </div>
        </div>
        <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
          {successMsg ? (
            <div className="w-[500px]">
              <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
                {successMsg}
              </p>
              <Link to="/signin">
                <button
                  className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold 
            tracking-wide hover:bg-black hover:text-white duration-300"
                >
                  Đăng Nhập
                </button>
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSignUp}
              className="w-full lgl:w-[500px] h-screen flex items-center justify-center"
            >
              <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-start overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
                <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">
                  Đăng ký tài khoản
                </h1>
                <div className="flex flex-col gap-3">
                  {/* client name */}
                  <div className="flex flex-col gap-.5">
                    <p className="font-titleFont text-base font-semibold text-gray-600">
                      Họ và tên
                    </p>
                    <input
                      onChange={handleName}
                      value={name}
                      className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                      type="text"
                      placeholder="Nhập Họ tên"
                    />
                    {errClientName && (
                      <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                        <span className="font-bold italic mr-1">!</span>
                        {errClientName}
                      </p>
                    )}
                  </div>
                  {/* Email */}
                  <div className="flex flex-col gap-.5">
                    <p className="font-titleFont text-base font-semibold text-gray-600">
                      Email
                    </p>
                    <input
                      onChange={handleEmail}
                      value={email}
                      className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                      type="email"
                      placeholder="Nhập địa chỉ Email"
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
                  {/* Phone Number */}
                  <div className="flex flex-col gap-.5">
                    <p className="font-titleFont text-base font-semibold text-gray-600">
                      Số điện thoại
                    </p>
                    <input
                      onChange={handlePhone}
                      value={phone}
                      className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                      type="text"
                      placeholder="Nhập Số điện thoại"
                    />
                    {errPhone && (
                      <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                        <span className="font-bold italic mr-1">!</span>
                        {errPhone}
                      </p>
                    )}
                  </div>
                  {/* Checkbox */}
                  <div className="flex items-start mdl:items-center gap-2">
                    <input
                      onChange={() => setChecked(!checked)}
                      className="w-4 h-4 mt-1 mdl:mt-0 cursor-pointer"
                      type="checkbox"
                    />
                    <p className="text-sm text-primeColor">
                      Tôi đồng ý với
                      <span className="text-blue-500">
                        {" "}
                        Điều khoản dịch vụ{" "}
                      </span>
                      và
                      <span className="text-blue-500">
                        {" "}
                        Chính sách quyền riêng tư{" "}
                      </span>
                      của JEANO STORE.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className={`${
                      checked
                        ? "bg-primeColor hover:bg-black hover:text-white cursor-pointer"
                        : "bg-[#ada9a1] hover:bg-black hover:text-gray-200 cursor-none"
                    } w-full text-gray-200 text-base font-medium h-10 rounded-md hover:text-white duration-300`}
                  >
                    Đăng Ký
                  </button>
                  <p className="text-sm text-center font-titleFont font-medium">
                    Bạn đã có tài khoản ?
                    <Link to="/signin">
                      <span className="hover:text-blue-600 duration-300 underline">
                        {" "}
                        Đăng Nhập
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

export default SignUp;
