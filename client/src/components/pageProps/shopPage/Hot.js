import React, { useEffect, useState } from "react";
import axios from "axios";
import numeral from "numeral";
import { BsSuitHeartFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Image from "../../designLayouts/Image";
import { addToCart } from "../../../redux/orebiSlice";
import Heading from "../../home/Products/Heading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const ROWS_PER_PAGE = 12;
const Hot = () => {
  const [selectedSortTag, setSelectedSortTag] = useState(null);
  const [radio, setRadio] = useState([]);
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    first: 0,
    rows: ROWS_PER_PAGE,
    page: 1,
    pageCount: 0,
    totalRecords: 0,
  });

  const handlePageClick = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    setPage(newPage);
    fetchProducts();
  };

  const handleProductDetails = (productSlug) => {
    navigate(`/product/${productSlug}`);
  };

  const fetchProducts = async () => {
    try {
      let apiUrl = `${process.env.REACT_APP_API}/api/v1/product/get-product?page=${page}&limit=${limit}&sortTag=HOT`;
      const { data } = await axios.get(apiUrl);

      setProducts(data.products);
      setPagination({
        ...pagination,
        pageCount: Math.ceil(data.total / ROWS_PER_PAGE), // Update based on the total number of records
        totalRecords: data.total, // Update with the total number of records
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch all products when the component mounts
    fetchProducts();
  }, [
    selectedSortTag,
    checked,
    radio,
    pagination.page,
    pagination.currentPage,
  ]);

  const onPage = (event) => {
    setPagination({
      ...pagination,
      first: event.first,
      rows: event.rows,
      page: event.page + 1,
    });
  };
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Show only 1 slide on smaller screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768, // Adjust breakpoint as needed
        settings: {
          slidesToShow: 2, // Show 2 slides on screens larger than 768px
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992, // Adjust breakpoint as needed
        settings: {
          slidesToShow: 3, // Show 3 slides on screens larger than 992px
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200, // Adjust breakpoint as needed
        settings: {
          slidesToShow: 4, // Show 4 slides on screens larger than 1200px
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleAddToCart = (product) => {
    if (product.size && product.size.length > 0) {
      const sizes = product.size.split(",");
      const defaultSize = sizes[0].trim();

      dispatch(
        addToCart({
          _id: product._id,
          name: product.name,
          quantity: 1,
          image: `${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`,
          badge: product.tag,
          price: product.price,
          slug: product.slug,
          size: defaultSize,
        })
      );
    } else {
      dispatch(
        addToCart({
          _id: product._id,
          name: product.name,
          quantity: 1,
          image: `${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`,
          badge: product.tag,
          price: product.price,
          slug: product.slug,
        })
      );
    }
  };

  return (
    <div>
      <Heading heading="HOT" />
      <Link to="/hot" className="flex justify-end items-end mx-5 underline">
        Xem tất cả
      </Link>
      <Slider {...sliderSettings}>
        {products.map((p) => (
          <div>
            <div className="w-[300px] h-[420px] relative group">
              <div key={p._id} className=" border-[1px] border-t-1">
                <div>
                  <Image
                    className="w-[300px] h-[300px]"
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
                <div className="w-[300px] h-[115px]  absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
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
                      onClick={() => handleAddToCart(p)}
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
              <div className="w-[300px] h-[115px] py-6 items-center justify-between text-center flex flex-col gap-1 border-[1px] border-t-1 px-4">
                <div className="flex items-center justify-between font-titleFont">
                  <h2 className="uppercase text-lg text-primeColor font-bold">
                    {p.name}
                  </h2>
                </div>
                <p className="text-[#767676] text-[14px] font-bold">
                  {numeral(p?.price).format("0,0")} VNĐ
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
export default Hot;
