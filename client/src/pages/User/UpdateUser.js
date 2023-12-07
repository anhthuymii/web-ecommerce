import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";
import SidebarUser from "../../components/Layout/SidebarUser";
import cities from "../../data/address.json";
import { Dropdown } from "primereact/dropdown";
import Title from "../../components/designLayouts/Title";

const UpdateUser = () => {
  const [auth, setAuth] = useAuth();
  const [user, setUser] = useState(null);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [detail, setDetail] = useState("");
  const navigate = useNavigate();
  const [formValid, setFormValid] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [errEmail, setErrEmail] = useState("");
  const [errName, setErrName] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [addressDetails, setAddressDetails] = useState({});
  const [formValue, setFormValue] = useState({
    city: null,
    district: null,
    commune: null,
    address: "",
  });
  const handlePhone = (e) => {
    const inputValue = e.target.value.slice(0, 10);
    setPhone(inputValue);
    setErrPhone("");
  };
  const handleName = (e) => {
    const inputValue = e.target.value.slice(0, 15);
    setName(inputValue);
    setErrName("");
  };
  const handleEmail = (e) => {
    const inputValue = e.target.value.slice(0, 20);
    setEmail(inputValue);
    setErrEmail("");
    if (!EmailValidation(inputValue)) {
      setErrEmail("Email không hợp lệ");
    }
  };
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };
  useEffect(() => {
    if (auth?.user) {
      const { id } = auth.user;
      setId(id);
    }
  }, [auth?.user]);

  useEffect(() => {
    const selectedCity =
      cities && cities.find((city) => city.Id === formValue.city);
    setDistricts(selectedCity?.Districts || []);
    const defaultDistrict = (selectedCity?.Districts || [])[0];
    setCommunes(defaultDistrict?.Communes || []);
  }, [formValue.city]);

  useEffect(() => {
    const selectedDistrict =
      districts &&
      districts.find((district) => district.Id === formValue.district);
    setCommunes(selectedDistrict?.Wards || []);
  }, [formValue.district, districts]);

  const handleCityChange = (e) => {
    const selectedCityName = e.value;
    const selectedCity = cities.find((city) => city.Name === selectedCityName);

    setDistricts(selectedCity?.Districts || []);
    const defaultDistrict = (selectedCity?.Districts || [])[0];
    setCommunes(defaultDistrict?.Communes || []);
    setFormValid(false);

    if (selectedCityName) {
      setFormValid(true);
    }

    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      city: selectedCityName,
      district: null,
      commune: null,
    }));
  };

  const handleDistrictChange = (e) => {
    const selectedDistrictName = e.value;
    const selectedDistrict = districts.find(
      (district) => district.Name === selectedDistrictName
    );

    setCommunes(selectedDistrict?.Wards || []);
    setFormValid(false);

    if (selectedDistrictName) {
      setFormValid(true);
    }

    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      district: selectedDistrictName,
      commune: null,
    }));
  };

  const handleCommuneChange = (e) => {
    setFormValue({
      ...formValue,
      commune: e.value,
    });
    setFormValid(!!e.value);
  };

  const handleAddressChange = (e) => {
    setFormValue({
      ...formValue,
      address: e.target.value,
    });
  };

  // ... (previous code)

  useEffect(() => {
    if (user && user.address) {
      const { city, district, commune, detail } = user.address;

      // Set the initial state of the form with the existing address details
      setFormValue({
        city: city || null,
        district: district || null,
        commune: commune || null,
        address: detail || "",
      });

      // Update other relevant states
      setCity(city || "");
      setDistricts([district]);
      setCommunes([commune]);
      setDetail(detail || "");
    }
  }, [user]);

  // ... (remaining code)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { city, district, commune, address } = formValue;
    const selectedCity = cities.find((c) => c.Id === city);
    const selectedDistrict = districts.find((d) => d.Id === district);
    const selectedCommune = communes.find((c) => c.Id === commune);

    const cityName = selectedCity?.Name || "";

    const districtName = selectedDistrict?.Name || "";
    const communeName = selectedCommune?.Name || "";
    if (!email) {
      setErrEmail("Vui lòng nhập Email");
    } else {
      if (!EmailValidation(email)) {
        setErrEmail("Vui lòng nhập Email");
      }
    }

    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/update-user/${id}`,
        {
          name: name,
          email: email,
          phone: phone,
          address: {
            city: cityName,
            district: districtName,
            commune: communeName,
            detail: address,
          },
        }
      );

      if (data?.success) {
        toast.success("Cập nhật thông tin thành công");

        const updatedUser = {
          ...user,
          address: { city, district, commune, detail: address },
        };

        setAuth({ ...auth, user: updatedUser });
        window.location.href = "/dashboard/user/profile";
      } else {
        toast.error(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("API request failed:", error);
      toast.error("Có lỗi xảy ra");
    }
  };
  const getUser = async () => {
    try {
      const userId = auth?.user?.id; // Ensure user ID is defined
      if (!userId) {
        console.error("User ID is undefined");
        return;
      }

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/user/${userId}`
      );
      const userData = data.user;

      setId(userData.id);
      setName(userData.name);
      setPhone(userData.phone);
      setEmail(userData.email);
      setCommunes(userData.address.communes);
      setCity(userData.address.city);
      setDetail(userData.address.detail);
      setDistricts(userData.address.districts);
      setUser(userData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [auth?.user]);

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Title title={"Cập nhật thông tin - JEANO Store"} />
      <SidebarUser />
      <div className="flex flex-col space-y-6 py-1 px-2">
        <div className="flex space-x-8 mx-5">
          <div className="isolate bg-white px-6 sm:py-10 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Cập nhật thông tin cá nhân
              </h2>
            </div>
            <form
              onSubmit={handleSubmit}
              action="#"
              method="POST"
              className="mx-auto max-w-xl sm:mt-5"
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Họ và tên
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={name}
                      onChange={handleName}
                      id="exampleInputEmail1"
                      placeholder="Nhập họ và tên"
                      autoFocus
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmail}
                      id="exampleInputEmail1"
                      // disabled
                      placeholder="Nhập Email"
                      autoFocus
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errEmail && (
                      <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                        <span className="font-bold italic mr-1">!</span>
                        {errEmail}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone-number"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Số điện thoại
                  </label>
                  <div className="mt-2.5">
                    <input
                      onChange={handlePhone}
                      value={phone}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      type="tel"
                      placeholder="Nhập Số điện thoại"
                    />
                    {errPhone && (
                      <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                        <span className="font-bold italic mr-1">!</span>
                        {errPhone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-row w-full sm:col-span-2">
                  <div className="w-80 p-1">
                    <p className="text-sm my-2 font-titleFont font-semibold px-2">
                      Thành phố/Tỉnh
                    </p>
                    <Dropdown
                      className="p-mb-3 text-center w-full p-3 rounded-md border-2 bg-gray"
                      options={cities}
                      optionValue="Id"
                      optionLabel="Name"
                      name="city"
                      value={formValue.city}
                      onChange={handleCityChange}
                      placeholder="Chọn tỉnh thành"
                      filter
                      showClear
                      filterBy="Name"
                    />
                  </div>

                  <div className="w-80 p-1">
                    <p className="text-sm my-2 font-titleFont font-semibold px-2">
                      Quận/Huyện
                    </p>
                    <Dropdown
                      className="p-mb-3 text-center w-full p-3 rounded-md border-2"
                      options={districts}
                      optionValue="Id"
                      optionLabel="Name"
                      name="district"
                      value={formValue.district}
                      onChange={handleDistrictChange}
                      placeholder="Chọn quận huyện"
                      filter
                      showClear
                      filterBy="Name"
                      disabled={!formValue.city}
                    />
                  </div>
                  <div className="w-80 p-1">
                    <p className="text-sm my-2 font-titleFont font-semibold px-2">
                      Xã/Phường
                    </p>
                    <Dropdown
                      className="p-mb-3  text-center w-full p-3 rounded-md border-2"
                      options={communes}
                      optionValue="Id"
                      optionLabel="Name"
                      name="commune"
                      value={formValue.commune}
                      onChange={handleCommuneChange}
                      placeholder="Chọn xã/phường"
                      filter
                      showClear
                      filterBy="Name"
                      disabled={!formValue.district}
                    />
                  </div>
                </div>
                <div className="w-full p-1">
                  <p className="text-sm my-2 font-titleFont font-semibold px-2">
                    Địa chỉ
                  </p>
                  <textarea
                    placeholder="Nhập địa chỉ"
                    className="resize p-mb-3 text-center w-full p-3 rounded-md border-2"
                    value={formValue.address}
                    onChange={handleAddressChange}
                  />
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
    </div>
  );
};

export default UpdateUser;
