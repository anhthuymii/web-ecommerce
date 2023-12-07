import { Menu } from "@headlessui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Sidebar from "../../components/Layout/Sidebar";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { AiOutlineDown } from "react-icons/ai";
import SizesList from "../../components/designLayouts/SizesList";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import useCategory from "../../hooks/useCategory";
import Title from "../../components/designLayouts/Title";

const UpdateProduct = () => {
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

  const [imageURL, setImageURL] = useState(null);
  const navigate = useNavigate();
  const categories = useCategory();
  const params = useParams();
  const [id, setId] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
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
  const [sizeList, setSizeList] = useState([]);
  const [tagList, setTagList] = useState("");

  const [tag] = useState([
    { name: "HOT" },
    { name: "NEW" },
    { name: "BEST SELLER" },
    { name: "SOLD OUT" },
    { name: "NOT" },
  ]);

  const [selectedTag, setSelectedTag] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);

  const toggleSize = (sizeName) => {
    if (selectedSizes.includes(sizeName)) {
      const updatedSizes = selectedSizes.filter((size) => size !== sizeName);
      setSelectedSizes(updatedSizes);
    } else {
      setSelectedSizes([...selectedSizes, sizeName]);
    }
  };
  const deleteSize = (name) => {
    const filtered = sizeList.filter((size) => size.name !== name);
    setSizeList(filtered);
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
  const handleBrand = (e) => {
    setBrand(e.target.value);
    setErrBrand("");
  };
  const handleDescription = (value) => {
    setDescription(value);
    setErrDescription("");
  };

  const handleTag = (e) => {
    setSelectedTag(e.target.value);
    setErrTag("");
  };

  console.log(selectedSizes);

  //create product function
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (quantity === "0") {
      setSelectedTag("SOLDOUT");
    }
    try {
      const formattedPrice = String(price).replace(/\D/g, "");
      const priceAsNumber = parseFloat(formattedPrice);
      if (isNaN(priceAsNumber)) {
        // Handle invalid price
        setErrPrice("Invalid price");
      } else {
        const productData = new FormData();
        const selectedCategoryId = categories.find(
          (c) => c.name === category
        )?._id;
        productData.append("category", selectedCategoryId);
        productData.append("name", name);
        productData.append("description", description);
        productData.append("price", priceAsNumber);
        productData.append("quantity", quantity);
        photo && productData.append("photo", photo);
        productData.append("size", selectedSizes);
        productData.append("tag", selectedTag);
        productData.append("brand", brand);
        const { data } = await axios.put(
          `${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,
          productData
        );
        console.log(data);
        console.log(data.status, data.message);

        if (data?.success) {
          toast.success(data.message || "Cập nhật sản phẩm thành công");
          window.location.href = "/dashboard/admin/products";
          // navigate("/dashboard/admin/products");
        } else {
          toast.error(data.message || "Có lỗi xảy ra");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      const product = data.product;
      setId(product._id);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setQuantity(product.quantity);
      // setPhoto(product.photo);
      setCategory(product.category.name);
      setBrand(product.brand);
      setSelectedTag(product.tag);
      if (product.sizes) {
        setSizeList(product.sizes);
      } else {
        setSizeList([]); // Initialize as an empty array if sizes is not defined
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleProduct();
    // if(!fetching) {
    //   setSizeList(product.sizes)
    // }
  }, []);
  return (
    <div className="w-full min-h-screen flex flex-row">
      <Title title={"Cập nhật sản phẩm - JEANO Store"} />
      <Sidebar />
      <div className="flex flex-col space-y-6 py-1 px-2">
        <div>
          <Breadcrumbs title="Cập nhật sản phẩm" prevLocation={prevLocation} />
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
                                value={category}
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
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    setImageURL(URL.createObjectURL(selectedFile));
                    setPhoto(selectedFile);
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
                  {photo ? (
                    <div className="text-center">
                      <img
                        src={imageURL}
                        alt="product_photo"
                        height={"200px"}
                        className="img img-responsive"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src={`/api/v1/product/product-photo/${id}`}
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
                                value={tag}
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
                  onClick={handleUpdate}
                  className="w-full md:w-44 bg-primeColor text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:bg-black hover:text-white duration-200"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateProduct;
