import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Dropdown } from "primereact/dropdown";
import cities from "../../data/address.json";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

const UpdateAddressShip = ({ user, order, onCancel }) => {
  const [formValid, setFormValid] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [formValue, setFormValue] = useState({
    city: null,
    district: null,
    commune: null,
    address: "",
  });
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [id, setId] = useState("");

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
  useEffect(() => {
    if (user && user.address) {
      setFormValue({
        city: user.address.city || null,
        district: user.address.district || null,
        commune: user.address.commune || null,
        address: user.address.detail || "",
      });
    } else {
      setFormValue({
        city: null,
        district: null,
        commune: null,
        address: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { city, district, commune, address } = formValue;
    const selectedCity = cities.find((c) => c.Id === city);
    const selectedDistrict = districts.find((d) => d.Id === district);
    const selectedCommune = communes.find((c) => c.Id === commune);

    const cityName = selectedCity?.Name || "";

    const districtName = selectedDistrict?.Name || "";
    const communeName = selectedCommune?.Name || "";
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/update-user/${id}`,
        {
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
        window.location.reload();
      } else {
        toast.error(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("API request failed:", error);
      toast.error("Xảy ra lỗi: " + error.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="fixed w-full h-full flex items-center justify-center">
      <div className="bg-black bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white top-10 p-5 rounded relative m-5">
          <AiOutlineClose
            className="absolute top-3 right-5 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={onCancel}
          />
          <h2 className="text-center text-lg font-bold tracking-tight text-gray-900 ">
            Địa chỉ giao hàng
          </h2>
          <form
            onSubmit={handleSubmit}
            method="POST"
            className="mx-auto w-full max-w-xl"
          >
            <div className="flex flex-col items-center justify-center grid-cols-1 gap-x-8 sm:grid-cols-2">
              <div className="w-80 p-1">
                <p className="text-sm my-2 font-titleFont font-semibold px-2">
                  Thành phố/Tỉnh
                </p>
                <Dropdown
                  className="p-mb-3 text-center w-60 p-3 rounded-md border-2 bg-gray"
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
                  className="p-mb-3 text-center  w-60 p-3 rounded-md border-2"
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
                  className="p-mb-3  text-center  w-60 p-3 rounded-md border-2"
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
              <div className="w-80 p-1">
                <p className="text-sm my-2 font-titleFont font-semibold px-2">
                  Địa chỉ
                </p>
                <textarea
                  placeholder="Nhập địa chỉ"
                  className="resize p-mb-3 text-center w-60 p-3 rounded-md border-2"
                  value={formValue.address}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
            <div className="mt-2 flex justify-center">
              <button
                // onClick={handleSubmit}
                disabled={!formValid}
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

export default UpdateAddressShip;
