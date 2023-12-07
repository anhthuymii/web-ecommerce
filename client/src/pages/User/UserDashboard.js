import React, { useEffect, useState } from "react";
// import Sidebar, { SidebarItem } from "../../components/Layout/Sidebar";
import { useAuth } from "../../context/auth";
import SidebarUser from "../../components/Layout/SidebarUser";
import { MdOutlineCreate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChangePassword from "./ChangePassword";
import Title from "../../components/designLayouts/Title";
const UserDashboard = () => {
  const [auth] = useAuth();
  const [user, setUser] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [addressDetails, setAddressDetails] = useState({});
  const [update, setUpdate] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const handleUpdate = (user) => {
    setUpdate(user);
    setShowUpdate(true);
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
    <div className="w-full min-h-screen flex flex-row">
      <Title title={"Thông tin cá nhân - JEANO Store"} />
      <SidebarUser />
      <div className="flex flex-col space-y-6 py-1 px-2">
        <div className="flex space-x-8">
          <div className="grow p-5 border rounded">
            <div className="relative p-3">
              <div className="flex text-xl font-bold">
                <p className="mr-5">Thông tin người dùng</p>
              </div>
              <div className="mt-2 space-y-2">
                <div>
                  <strong>Tên tài khoản:</strong> {user.name}
                </div>
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
                <div>
                  <strong>Số điện thoại:</strong> {user.phone}
                </div>
                <div>
                  {addressDetails.city && (
                    <div>
                      <strong>Địa chỉ: </strong>
                      {addressDetails.detail && addressDetails.detail},{" "}
                      {addressDetails.commune && `${addressDetails.commune}, `}
                      {addressDetails.district &&
                        `${addressDetails.district}, `}
                      {`${addressDetails.city} `}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-end justify-end mt-3">
              <p
                className="text-base font-semibold mx-5 cursor-pointer"
                onClick={() => navigate(`/dashboard/user/update-user`)}
              >
                Cập nhật thông tin
              </p>

              <p
                className="flex justify-end text-base font-semibold"
                onClick={() => handleUpdate(auth.user)}
              >
                Đổi mật khẩu
              </p>
              {showUpdate && (
                <ChangePassword
                  user={auth.user}
                  order={update}
                  onCancel={() => {
                    setShowUpdate(false);
                    setUpdate(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
