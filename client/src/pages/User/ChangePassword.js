import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

const ChangePassword = ({ onCancel }) => {
  const [auth, setAuth] = useAuth();
  const user = auth;
  const [id, setId] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = auth?.user?.id;
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/changePassword/${userId}`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        }
      );
      console.log("id", id);

      if (data?.success) {
        toast.success("Đổi mật khẩu thành công");
        window.location.reload();
        // navigate("/dashboard/user/profile");
      } else {
        toast.error(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("API request failed:", error);
      toast.error("Xảy ra lỗi: " + error.message || "Có lỗi xảy ra");
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-black bg-opacity-30 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-5 rounded relative m-5">
          <AiOutlineClose
            className="absolute top-3 right-5"
            onClick={onCancel}
          />
          <h2 className="text-center text-lg font-bold tracking-tight text-gray-900 ">
            Đổi mật khẩu
          </h2>
          <form
            onSubmit={handleSubmit}
            // action="#"
            method="POST"
            className="mx-auto max-w-xl sm:mt-5"
          >
            <div className="flex flex-col items-center justify-center grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold">
                  Mật khẩu hiện tại
                </p>
                <input
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  value={currentPassword}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="text"
                  placeholder="Nhập Mật khẩu hiện tại"
                />
                {/*errPassword && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errPassword}
                  </p>
                )*/}
              </div>
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold">
                  Mật khẩu mới
                </p>
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="text"
                  placeholder="Nhập Mật khẩu mới"
                />
                {/*errPassword && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errPassword}
                  </p>
                )*/}
              </div>
            </div>
            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                className="w-full md:w-44 bg-primeColor text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:bg-black hover:text-white duration-200"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
