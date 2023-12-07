import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useCategory from "../../../hooks/useCategory";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import toast from "react-hot-toast";
import BannerMini from "../../designLayouts/BannerMini";
import Breadcrumbs from "../../pageProps/Breadcrumbs";
import Image from "../../designLayouts/Image";
import { FaShoppingCart } from "react-icons/fa";
import { BsSuitHeartFill } from "react-icons/bs";
import numeral from "numeral";
import { MdOutlineLabelImportant } from "react-icons/md";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Title from "../../designLayouts/Title";
const ROWS_PER_PAGE = 12;

const NewProduct = (props) => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  const categories = useCategory();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedSortTag, setSelectedSortTag] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    first: 0,
    rows: ROWS_PER_PAGE,
    page: 1,
    pageCount: 0,
    totalRecords: 0,
  });

  const handleProductDetails = (productSlug) => {
    navigate(`/product/${productSlug}`);
  };

  useEffect(() => {
    if (params?.slug) getProductsByCat();
  }, [params?.slug]);
  const getProductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageClick = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    setPage(newPage);
    // fetchProducts();
  };

  const fetchProducts = async () => {
    try {
      let apiUrl = `${process.env.REACT_APP_API}/api/v1/product/get-product?page=${page}&limit=${limit}&sortTag=NEW`;
      const { data } = await axios.get(apiUrl);
      console.log("API Response:", data);
      console.log("Fetched products for page:", page);
      setProducts(data.products);
      setPagination({
        ...pagination,
        pageCount: Math.ceil(data.total / ROWS_PER_PAGE),
        totalRecords: data.total,
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleAddToCart = (product) => {
    if (
      product.tag !== "SOLDOUT" &&
      (product.quantity === undefined || product.quantity > 0)
    ) {
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
    } else {
      toast.error("Sản phẩm đang hết hàng");
    }
  };

  return (
    <div className="max-w-container mx-auto">
    <Title title={"Sản phẩm mới - JEANO Store"} />
      <BannerMini />
      <Breadcrumbs title="DANH MỤC SẢN PHẨM" />
      <div className="w-full h-full flex pb-10">
        <div className="w-[17%] lgl:w-[17%] hidden mdl:inline-flex h-full bg-primeColor">
          <ul className="flex flex-col gap-2 text-white m-5 text-sm lg:text-base ">
            <li className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link to="/categories" className="text-lg font-bold">
                  TẤT CẢ SẢN PHẨM
                </Link>
              </div>
            </li>
            <li className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link to="/hot" className="text-lg font-bold">
                  HOT
                </Link>
              </div>
            </li>
            <li className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link to="/new" className="text-lg font-bold">
                  NEW
                </Link>
              </div>
            </li>
            <li className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link to="/best-seller" className="text-lg font-bold">
                  BEST SELLER
                </Link>
              </div>
            </li>
            {categories.map((c) => (
              <li
                className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between"
                key={c._id}
              >
                <div className="flex items-center gap-2">
                  <Link
                    to={`/category/${c.slug}`}
                    className="text-lg font-bold"
                  >
                    {c.name}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full mdl:w-[83%] lgl:w-[83%] h-full flex flex-col ">
          <h1 className="text-2xl uppercase mb-5 text-center text-primeColor font-titleFont font-bold">
            sản phẩm mới
          </h1>
          <p className="text-sm text-center font-normal capitalize mt-0">
            {pagination.totalRecords} sản phẩm
          </p>
          <div className="w-full">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 m-5 gap-3">
              {products.map((p) => (
                <div className="w-[250px] h-[360px] mb-10 relative group ">
                  <div
                    key={p._id}
                    className="max-w-80 max-h-80 border-[1px] relative overflow-hidden "
                  >
                    <div>
                      <Image
                        className="w-[300px] h-[280px]"
                        imgSrc={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        onClick={() => handleProductDetails(p.slug)}
                      />
                    </div>
                    {p.tag && p.tag !== "NOT" && (
                      <div className="absolute top-6 left-8">
                        <div
                          className={`w-[92px] h-[35px] text-white flex justify-center items-center text-sm font-semibold hover:bg-black duration-300 cursor-pointer ${
                            p.tag === "SOLDOUT" || p.quantity === 0
                              ? "bg-red-500 line-through"
                              : "bg-primeColor"
                          }`}
                        >
                          {p.tag === "SOLDOUT" || p.quantity === 0
                            ? "SOLDOUT"
                            : p.tag}
                        </div>
                      </div>
                    )}
                    <div className="w-full h-[115px]  absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
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
                  <div className="w-full h-[115px] py-6  text-center items-center justify-center flex flex-col gap-1 border-[1px] border-t-1 px-4">
                    <div className="flex items-center justify-between font-titleFont">
                      <h2 className="text-lg uppercase text-primeColor font-bold">
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
        </div>
      </div>
      <ReactPaginate
        pageCount={pagination.pageCount}
        onPageChange={handlePageClick}
        containerClassName="flex justify-center items-center text-base font-semibold font-titleFont py-10"
        activeClassName="bg-black text-white"
        pageLinkClassName="w-9 justify-center items-center h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
        pageClassName="m-4"
        previousLabel="<"
        nextLabel=">"
      />
    </div>
  );
};

export default NewProduct;
