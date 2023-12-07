import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";

const Payment = () => {
  const [auth, setAuth] = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        address,
        phone,
        email,
        password,
      });
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updateUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updateUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Cập nhật thông tin thành công");
      }
    } catch (error) {
      console.log(error);
      toast.error("Xảy ra lỗi");
    }
  };

  //get user data
  useEffect(() => {
    if (auth?.user) {
      const { name, phone, address } = auth.user;
      setName(name);
      setPhone(phone);
      // setEmail(email);
      setAddress(address);
    }
  }, [auth?.user]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Payment gateway" />
      <div className="pb-10">Thanh toan thanh cong</div>
    </div>
  );
};

export default Payment;
