import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import { useAuth } from "../../context/auth";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axios from "axios";
import ChangePassword from "../User/ChangePassword";
import { useNavigate } from "react-router-dom";
import Title from "../../components/designLayouts/Title";

const InfoAdmin = () => {
  const [auth] = useAuth();
  const [prevLocation, setPrevLocation] = useState("");
  const [addressDetails, setAddressDetails] = useState({});
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const [update, setUpdate] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const handleUpdate = (user) => {
    setUpdate(user);
    setShowUpdate(true);
  };
  const getUser = async () => {
    try {
      const userId = auth?.user?.id;
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/user/${userId}`
      );

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
      <Title title={"Thông tin cá nhân - JEANO Store"} />
      <Sidebar />
      <div className="flex flex-col space-y-6 py-1 px-2">
        <div>
          <Breadcrumbs title="Thông tin cá nhân" prevLocation={prevLocation} />
        </div>
        <div className="w-full border rounded xl:w-12/12 px-1">
          <div className="w-full p-3">
            <div className="text-lg font-bold">Thông tin người dùng</div>
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
                <strong>Địa chỉ:</strong>{" "}
                {addressDetails.detail && addressDetails.detail},{" "}
                {addressDetails.commune && `${addressDetails.commune}, `}
                {addressDetails.district && `${addressDetails.district}, `}
                {`${addressDetails.city} `}{" "}
              </div>
            </div>
            <div className="flex flex-row items-end justify-end mt-3">
              <p
                className="text-base font-semibold mx-5 cursor-pointer"
                onClick={() => navigate(`/dashboard/admin/update-admin`)}
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

export default InfoAdmin;
