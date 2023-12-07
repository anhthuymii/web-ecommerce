import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlineDown } from "react-icons/ai";
import { Menu } from "@headlessui/react";
import useCategory from "../../hooks/useCategory";
import SizesList from "../../components/designLayouts/SizesList";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import Title from "../../components/designLayouts/Title";

const CreateProduct = () => {
  const [prevLocation, setPrevLocation] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errCategory, setErrCategory] = useState("");
  const [errName, setErrName] = useState("");
  const [errPrice, setErrPrice] = useState("");
  const [errSizes, setErrSizes] = useState("");
  const [errBrand, setErrBrand] = useState("");
  const [errTag, setErrTag] = useState("");
  const [errPhoto, setErrPhoto] = useState("");
  const [errQuantity, setErrQuantity] = useState("");
  const [errDescription, setErrDescription] = useState("");

  // const [errMessages, setErrMessages] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const navigate = useNavigate();
  const categories = useCategory();
  // const [checked, setChecked] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState([]);
  const [brand, setBrand] = useState("");

  const [sizes] = useState([
    { name: "XS" },
    { name: "S" },
    { name: "M" },
    { name: "L" },
    { name: "XL" },
    { name: "Free size" },
    { name: "NOT" },
  ]);

  const [tag] = useState([
    { name: "HOT" },
    { name: "NEW" },
    { name: "BEST SELLER" },
    { name: "SOLD OUT" },
    { name: "NOT" },
  ]);
  const [sizeList, setSizeList] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const deleteSize = (name) => {
    const updatedSizes = selectedSizes.filter((size) => size !== name);
    setSelectedSizes(updatedSizes);
  };

  const toggleSize = (sizeName) => {
    if (selectedSizes.includes(sizeName)) {
      const updatedSizes = selectedSizes.filter((size) => size !== sizeName);
      setSelectedSizes(updatedSizes);
    } else {
      setSelectedSizes([...selectedSizes, sizeName]);
    }
  };

  const handleName = (e) => {
    setName(e.target.value);
    setErrName("");
  };
  const handlePrice = (e) => {
    setPrice(e.target.value);
    setErrPrice("");
  };
  const handleQuantity = (e) => {
    const newQuantity = e.target.value;

    if (newQuantity === "0") {
      setSelectedTag("SOLDOUT");
      setQuantity("0");
    } else {
      setSelectedTag("");
      setQuantity(newQuantity);
    }

    const restrictedTags = ["NOT", "BEST SELLER", "HOT", "NEW"];

    if (restrictedTags.includes(selectedTag) && newQuantity < 1) {
      setErrQuantity("Số lượng không được nhỏ hơn 1 khi chọn tag này.");
    } else {
      setErrQuantity("");
    }
  };

  const handleSizes = (e) => {
    setSizeList(e.target.value);
    setErrSizes("");
  };
  const handleBrand = (e) => {
    setBrand(e.target.value);
    setErrBrand("");
  };
  const handleDescription = (value) => {
    setDescription(value);
    setErrDescription("");
  };
  const handleCategory = (e) => {
    setCategory(e.target.value);
    setErrCategory("");
  };
  const handleTag = (e) => {
    setSelectedTag(e.target.value);
    setErrTag("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (quantity === "0") {
      setSelectedTag("SOLDOUT");
    }
    setErrName("");
    setErrCategory("");
    setErrDescription("");
    setErrPrice("");
    setErrQuantity("");
    setErrSizes("");
    setErrTag("");
    setErrBrand("");
    setErrPhoto("");
    setSuccessMsg("");

    if (!name) {
      setErrName("Vui lòng nhập tên sản phẩm");
    }
    if (!category) {
      setErrCategory("Vui lòng chọn thể loại");
    }
    if (!description) {
      setErrDescription("Vui lòng nhập mô tả");
    }
    if (!price) {
      setErrPrice("Vui lòng nhập giá sản phẩm");
    }
    if (!quantity) {
      setErrQuantity("Vui lòng nhập số lượng");
    }
    if (sizeList.length === 0) {
      setErrSizes("Vui lòng chọn size");
    }
    if (!selectedTag) {
      setErrTag("Vui lòng chọn tag");
    }
    if (!brand) {
      setErrBrand("Vui lòng nhập nhãn hàng");
    }
    if (!photo) {
      setErrPhoto("Vui lòng chọn ảnh");
    }

    if (
      name &&
      category &&
      description &&
      price &&
      quantity &&
      sizeList &&
      selectedTag &&
      brand &&
      photo
    ) {
      try {
        const formattedPrice = price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });

        const productData = new FormData();
        const selectedCategoryId = categories.find(
          (c) => c.name === category
        )?._id;
        productData.append("category", selectedCategoryId);

        productData.append("name", name);
        productData.append("description", description);
        productData.append("price", formattedPrice);
        productData.append("quantity", quantity);
        productData.append("photo", photo);
        productData.append("size", selectedSizes);
        productData.append("tag", selectedTag);
        productData.append("brand", brand);

        const res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/product/create-product`,
          productData
        );

        if (res.data.success) {
          console.log(res.data);
          toast.success(res.data.message);
          navigate("/dashboard/admin/products");
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Có lỗi xảy ra");
      }
    }
  };
  return (
    <div className="w-full min-h-screen flex flex-row">
    <Title title={"Cập nhật sản phẩm - JEANO Store"} />
      <Sidebar />
      <div className="flex flex-col space-y-6 py-1 px-2">
        <div>
          <Breadcrumbs title="Tạo sản phẩm" prevLocation={prevLocation} />
        </div>
        {successMsg ? (
          <p className="pb-6 md:pb-20 w-full font-medium text-green-500">
            {successMsg}
          </p>
        ) : (
          <form className="w-full rounded xl:w-12/12 px-3">
            <div className="flex flex-wrap">
              <div className="w-full md:w-6/12 p-3">
                <p className="text-base font-titleFont font-semibold px-2">
                  Thể loại
                </p>
                <Menu as="div" className="relative inline-block text-left">
                  {({ open }) => (
                    <>
                      <div>
                        <span className="rounded-md shadow-sm">
                          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            {category || "Chọn thể loại"}
                            <AiOutlineDown
                              className="-mr-1 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </span>
                      </div>

                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {categories?.map((c) => (
                          <Menu.Item key={c._id} value={c._id}>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-gray-100" : "bg-white"
                                } block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left`}
                                onClick={() => setCategory(c.name)}
                                onChange={(value) => {
                                  setCategory(value);
                                  setErrCategory("");
                                }}
                              >
                                {c.name}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </>
                  )}
                </Menu>
                {errCategory && (
                  <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                    <span className="text-sm italic font-bold">!</span>
                    {errCategory}
                  </p>
                )}
              </div>
              <div className="w-full md:w-6/12 p-3">
                <p className="text-base font-titleFont font-semibold px-2">
                  Tên sản phẩm
                </p>
                <input
                  type="text"
                  value={name}
                  placeholder="Đặt tên sản phẩm"
                  onChange={handleName}
                  className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                />
                {errName && (
                  <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                    <span className="text-sm italic font-bold">!</span>
                    {errName}
                  </p>
                )}
              </div>
              <div className="w-full md:w-6/12 p-3">
                <p className="text-base mt-3 font-titleFont font-semibold px-2">
                  Thêm ảnh mới
                </p>
                {photo ? photo.name : "Cập nhật ảnh"}
                <input
                  type="file"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  name="photo"
                  accept="image/*"
                  multiple
                  // onChange={(e) => setPhoto(e.target.files[0])}
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    setImageURL(URL.createObjectURL(selectedFile)); // Create object URL
                    setPhoto(selectedFile); // Set the selected file in your state
                  }}
                  hidden
                />

                {errPhoto && (
                  <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                    <span className="text-sm italic font-bold">!</span>
                    {errPhoto}
                  </p>
                )}
              </div>
              <div className="w-full md:w-6/12 p-3">
                <div className="mt-3 border rounded w-40 h-40">
                  {photo && (
                    <div className="text-center">
                      <img
                        src={imageURL}
                        alt="product_photo"
                        height={"200px"}
                        className="img img-responsive"
                      />
                    </div>
                  )}
                </div>
                {errPhoto && (
                  <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                    <span className="text-sm italic font-bold">!</span>
                    {errPhoto}
                  </p>
                )}
              </div>
              <div className="w-full md:w-6/12 p-3">
                <p className="text-base font-titleFont font-semibold px-2">
                  Số lượng
                </p>

                <input
                  type="number"
                  value={quantity}
                  placeholder="Nhập số lượng sản phẩm"
                  onChange={handleQuantity}
                  disabled={selectedTag === "SOLDOUT"}
                  className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                />
                {errQuantity && (
                  <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                    <span className="text-sm italic font-bold">!</span>
                    {errQuantity}
                  </p>
                )}
              </div>
              <div className="w-full md:w-6/12 p-3">
                <p className="text-base font-titleFont font-semibold px-2">
                  Tag
                </p>
                <Menu as="div" className="relative inline-block text-left">
                  {({ open }) => (
                    <>
                      <div>
                        <span className="rounded-md shadow-sm">
                          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover-bg-gray-50">
                            {selectedTag ? selectedTag : "Chọn Tag"}
                            <AiOutlineDown
                              className="-mr-1 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </span>
                      </div>

                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {tag.map((t) => (
                          <Menu.Item key={t.name}>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-gray-100" : "bg-white"
                                } block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left`}
                                onClick={() => {
                                  setSelectedTag(t.name);
                                }}
                                onChange={handleTag}
                              >
                                {t.name}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </>
                  )}
                </Menu>
                {errTag && (
                  <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                    <span className="text-sm italic font-bold">!</span>
                    {errTag}
                  </p>
                )}
              </div>
              <div className="w-full md:w-6/12 p-3">
                <p className="text-base font-titleFont font-semibold px-2">
                  Tên nhãn hàng
                </p>
                <input
                  type="text"
                  value={brand}
                  placeholder="Nhập tên nhãn hàng"
                  onChange={handleBrand}
                  className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                />
                {errBrand && (
                  <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                    <span className="text-sm italic font-bold">!</span>
                    {errBrand}
                  </p>
                )}
              </div>
              <div className="w-full md:w-6/12 p-3">
                <p className="text-base font-titleFont font-semibold px-2">
                  Giá tiền
                </p>
                <input
                  type="number"
                  value={price}
                  placeholder="Nhập giá sản phẩm"
                  onChange={handlePrice}
                  className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                />
                {errPrice && (
                  <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                    <span className="text-sm italic font-bold">!</span>
                    {errPrice}
                  </p>
                )}
              </div>

              <div className="w-full md:w-6/12 p-3">
                <p className="text-base font-titleFont font-semibold px-2">
                  Chọn Size
                </p>
                {sizes.length > 0 && (
                  <div className="flex flex-wrap mx-1 my-2">
                    {sizes.map((size) => (
                      <div
                        key={size.name}
                        className={`rounded text-lg m-1 px-3 ${
                          selectedSizes.includes(size.name)
                            ? "bg-black text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => toggleSize(size.name)}
                      >
                        {size.name}
                      </div>
                    ))}
                  </div>
                )}
                {errSizes && (
                  <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                    <span className="text-sm italic font-bold">!</span>
                    {errSizes}
                  </p>
                )}
              </div>
              <div className="w-full md:w-6/12 p-3">
                <SizesList
                  selectedSizes={selectedSizes}
                  deleteSize={deleteSize}
                />
              </div>
              <div className="w-full p-3">
                <p className="text-base font-titleFont font-semibold px-2">
                  Mô tả sản phẩm
                </p>
                <ReactQuill
                  theme="snow"
                  id="description"
                  value={description}
                  onChange={handleDescription}
                  placeholder="Nhập mô tả sản phẩm"
                />
                {errDescription && (
                  <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                    <span className="text-sm italic font-bold">!</span>
                    {errDescription}
                  </p>
                )}
              </div>
              <div className="w-full p-3">
                <button
                  type="submit"
                  onClick={handleCreate}
                  className="w-full md:w-44 bg-primeColor text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:bg-black hover:text-white duration-200"
                >
                  Lưu
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateProduct;
