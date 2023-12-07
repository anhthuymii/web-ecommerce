import React, { useEffect, useState } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { addToCart } from "../../../redux/orebiSlice";

const Product = ({ name, price, description /* other props */ }) => {
  // console.log("Product Component Props:", name, price, description);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedSortTag, setSelectedSortTag] = useState(null);

  const handleProductDetails = (productSlug) => {
    navigate(`/product/${productSlug}`);
  };

  const [products, setProducts] = useState([]);

  const [itemsPerPage, setItemsPerPage] = useState(12);

  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };
  const fetchProducts = async () => {
    try {
      let apiUrl = `${process.env.REACT_APP_API}/api/v1/product/get-product?page=1&limit=${itemsPerPage}`;

      if (selectedSortTag) {
        apiUrl += `&sortTag=${selectedSortTag}`;
      }

      const { data } = await axios.get(apiUrl);
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [selectedSortTag, itemsPerPage]);

  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);

  useEffect(() => {
    if (!checked.length || !radio.length) fetchProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filtered product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {products
          .filter((p) => p.quantity > 0) // Lọc ra chỉ những sản phẩm có số lượng lớn hơn 0
          .map((p) => (
            <div className="w-100 h-100 relative group ">
              <div
                key={p._id}
                className="max-w-80 max-h-80 border-[1px] relative overflow-hidden "
              >
                <div>
                  <Image
                    className="w-full h-full"
                    imgSrc={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    onClick={() => handleProductDetails(p.slug)}
                  />
                </div>
                {p.tag && p.tag !== "NOT" && (
                  <div className="absolute top-6 left-8">
                    <div className="bg-primeColor w-[92px] h-[35px] text-white flex justify-center items-center text-sm font-semibold hover:bg-black duration-300 cursor-pointer">
                      {p.tag}
                    </div>
                  </div>
                )}
                <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
                  <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
                    <li
                      onClick={() => handleProductDetails(p.slug)}
                      className="text-[#767676] hover:text-primeColor text-base font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
                    >
                      Xem chi tiết
                      <span>
                        <MdOutlineLabelImportant />
                      </span>
                    </li>
                    <li
                      onClick={() =>
                        dispatch(
                          addToCart({
                            _id: p._id,
                            name: p.name,
                            quantity: 1,
                            image: `${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`,
                            badge: p.tag,
                            price: p.price,
                            slug: p.slug,
                            size: p.sizeState,
                          })
                        )
                      }
                      className="text-[#767676] hover:text-primeColor text-base font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
                    >
                      Thêm vào giỏ hàng
                      <span>
                        <FaShoppingCart />
                      </span>
                    </li>
                    <li className="text-[#767676] hover:text-primeColor text-base font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full">
                      Them vào yêu thích
                      <span>
                        <BsSuitHeartFill />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="max-w-80 py-6 text-center flex flex-col gap-1 border-[1px] border-t-1 px-4">
                <div className="flex items-center justify-between font-titleFont">
                  <h2 className="text-lg text-primeColor font-bold">
                    {p.name}
                  </h2>
                </div>
                <p className="text-[#767676] text-[14px] font-bold">
                  {numeral(p?.price).format("0,0")} VNĐ
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Product;
