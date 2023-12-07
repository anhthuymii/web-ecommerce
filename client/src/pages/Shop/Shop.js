import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
// import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
// import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";
// import Product from "../../components/home/Products/Product";
import axios from "axios";
import NavTitle from "../../components/pageProps/shopPage/shopBy/NavTitle";
import { motion } from "framer-motion";
import { Prices } from "../../components/pageProps/shopPage/shopBy/Price";
import numeral from "numeral";
import { BsSuitHeartFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { addToCart } from "../../redux/orebiSlice";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../components/designLayouts/Image";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ReactPaginate from "react-paginate";
import toast from "react-hot-toast";
import BannerMini from "../../components/designLayouts/BannerMini";
import Title from "../../components/designLayouts/Title";
const ROWS_PER_PAGE = 12;

const Shop = () => {
  const [selectedSortTag, setSelectedSortTag] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [radio, setRadio] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [showPrice, setShowPrice] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    first: 0,
    rows: ROWS_PER_PAGE,
    page: 1,
    pageCount: 0,
    totalRecords: 0,
  });

  const [pageCount, setPageCount] = useState(1);

  const handlePageClick = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    setPage(newPage);
    // fetchProducts();
  };

  const handleNextPage = () => {
    if (page < pagination.pageCount) {
      setPage(page + 1);
      fetchProducts();
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      fetchProducts();
    }
  };

  const handleProductDetails = (productSlug) => {
    navigate(`/product/${productSlug}`);
  };

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const fetchProducts = async () => {
    try {
      let apiUrl = `${process.env.REACT_APP_API}/api/v1/product/get-product?page=${page}&limit=${limit}`;

      if (selectedSortTag) {
        apiUrl += `&sortTag=${selectedSortTag}`;
      }

      if (checked.length > 0) {
        apiUrl += `&category=${checked.join(",")}`;
      }

      if (radio && radio.length === 2 && !isNaN(radio[0]) && !isNaN(radio[1])) {
        apiUrl += `&priceRange=${radio.join("-")}`;
      }

      const { data } = await axios.get(apiUrl);

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
  }, [selectedSortTag, checked, radio, page]);

  const onPage = (event) => {
    setPagination({
      ...pagination,
      first: event.first,
      rows: event.rows,
      page: event.page + 1,
    });
  };

  const handleSortTagChange = (sortTag) => {
    setSelectedSortTag(sortTag);
    fetchProducts(sortTag);
  };
  const handleFilter = (categorySlug) => {
    setChecked((prevChecked) => {
      const isCategoryChecked = prevChecked.includes(categorySlug);
      const updatedChecked = isCategoryChecked
        ? prevChecked.filter((slug) => slug !== categorySlug)
        : [...prevChecked, categorySlug];
      fetchProducts();
      return updatedChecked;
    });
  };

  const handlePriceFilter = (selectedPrice) => {
    setRadio(selectedPrice);
    fetchProducts();
  };

  const fetchAllProducts = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API}/api/v1/product/get-product?page=1&limit=10`;
      const { data } = await axios.get(apiUrl);
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = (product) => {
    if (
      product.tag !== "SOLDOUT" &&
      (product.quantity === undefined || product.quantity > 0)
    ) {
      if (product.size && product.size.length > 0) {
        // Split sizes by comma and use the first size as the default
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
            size: defaultSize, // Use the default size
          })
        );
      } else {
        // If no sizes are available, add the product without a size
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
      <Title title={"Sản phẩm - JEANO Store"} />
      <BannerMini />
      <Breadcrumbs title="SẢN PHẨM" />
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[10%] flex-col lgl:w-[20%] mx-4 hidden mdl:inline-flex h-full">
          <div className="w-full">
            <NavTitle title="Shop by Category" icons={false} />
            <div>
              <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
                {categories?.map((c) => (
                  <li
                    key={c._id}
                    onClick={() => handleFilter(c.slug)}
                    className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox accent-black md:accent-black text-primeColor"
                      />
                      {c.name}
                    </label>
                  </li>
                ))}

                {/*JSON.stringify(checked, null, 4)*/}
              </ul>
            </div>
          </div>
          <div className="cursor-pointer my-10">
            <NavTitle
              title="Shop by Price"
              icons={true}
              onClick={() => setShowPrice(!showPrice)}
            />
            {showPrice && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="font-titleFont">
                  <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
                    {Prices.map((p) => (
                      <li
                        key={p._id}
                        className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
                        onClick={() => handlePriceFilter(p.array)}
                      >
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            className="form-radio accent-black md:accent-black text-primeColor"
                            name="price"
                            value={p.array}
                          />
                          {p.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
          <div
            className="w-full bg-primeColor h-[35px] text-white flex justify-center items-center text-base uppercase font-semibold hover:bg-black duration-300 cursor-pointer"
            onClick={() => {
              setChecked([]);
              setRadio([]);
              setSelectedSortTag(null);
              setShowPrice(true);
              fetchAllProducts();
            }}
          >
            Đặt lại
          </div>
        </div>
        <div className="w-full mdl:w-[90%] lgl:w-[80%] h-full flex flex-col">
          <ProductBanner
            itemsPerPageFromBanner={setItemsPerPage}
            onSortTagChange={handleSortTagChange}
          />
          <div className="w-full my-3">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {products.map((p) => (
                <div className="w-[230px] h-[360px] mb-10 relative group ">
                  <div
                    key={p._id}
                    className="max-w-80 max-h-80 border-[1px] relative overflow-hidden "
                  >
                    <div>
                      <Image
                        className="w-[280px] h-[280px]"
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
                  <div className="w-full h-[115px] py-6 text-center flex flex-col gap-1 border-[1px] border-t-1 px-4">
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
          <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
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
            <div className="text-center text-[#767676] mt-4">
              Page {page} of {pagination.pageCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Shop;
