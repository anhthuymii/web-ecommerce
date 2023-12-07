import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import numeral from "numeral";
import axios from "axios";
import Image from "../../components/designLayouts/Image";
import { MdOutlineLabelImportant } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { BsSuitHeartFill } from "react-icons/bs";
import { addToCart } from "../../redux/orebiSlice";
import { useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import toast from "react-hot-toast";
import Title from "../../components/designLayouts/Title";

const SearchProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { keyword } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [pagination, setPagination] = useState({
    pageCount: 1,
  });
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const handleProductDetails = (productSlug) => {
    navigate(`/product/${productSlug}`);
  };

  const handlePageClick = (selectedPage) => {
    setPage(selectedPage.selected + 1);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API}/api/v1/search/${keyword}`, {
        params: { page: currentPage },
      })
      .then((response) => {
        const totalResultsValue = response.data.result.hits.total.value;
        const hits = response.data.result.hits.hits || [];
        setSearchResults(hits);
        setTotalResults(totalResultsValue);
        // setPagination({
        //   pageCount: Math.ceil(totalResultsValue / itemsPerPage),
        // });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [keyword, currentPage]);

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
    <div className="max-w-container mx-auto px-4">
      <Title title={"Kết quả tìm kiếm - JEANO Store"} />
      <Breadcrumbs title="TÌM KIẾM SẢN PHẨM" prevLocation="" />
      <div className="pb-10">
        <div className="text-center my-5 justify-center items-center">
          <h1 className="text-lg font-bold">Kết quả tìm kiếm: "{keyword}"</h1>
        </div>
        <h3 className="text-center font-bold text-lg mb-2">
          {searchResults.length > 0
            ? `Đã tìm thấy ${totalResults} sản phẩm`
            : `Không tìm thấy sản phẩm #${keyword}`}
        </h3>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {searchResults.map((product) => (
            <div className="w-full relative group ">
              <div
                key={product._source.searchResultData._id}
                className="max-w-80 max-h-80 border-[1px] relative overflow-hidden "
              >
                <div>
                  <Image
                    className="w-[300px] h-[300px] md:w-full"
                    imgSrc={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._source.searchResultData._id}`}
                    alt={product._source.searchResultData.name}
                    onClick={() =>
                      handleProductDetails(
                        product._source.searchResultData.slug
                      )
                    }
                  />
                </div>
                {product._source.searchResultData.tag &&
                  product._source.searchResultData.tag !== "NOT" && (
                    <div className="absolute top-6 left-8">
                      <div
                        className={`w-[92px] h-[35px] text-white flex justify-center items-center text-sm font-semibold hover:bg-black duration-300 cursor-pointer ${
                          product._source.searchResultData.tag === "SOLDOUT" ||
                          product._source.searchResultData.quantity === 0
                            ? "bg-red-500 line-through"
                            : "bg-primeColor"
                        }`}
                      >
                        {product._source.searchResultData.tag}
                      </div>
                    </div>
                  )}
                <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
                  <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
                    <li
                      onClick={() =>
                        navigate(
                          `/product/${product._source.searchResultData.slug}`
                        )
                      }
                      className="text-[#767676] hover:text-primeColor text-base font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full"
                    >
                      Xem chi tiết
                      <span>
                        <MdOutlineLabelImportant />
                      </span>
                    </li>
                    <li
                      onClick={() =>
                        handleAddToCart(product._source.searchResultData)
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
              <div className="max-w-80 py-6 text-center items-center justify-center  flex flex-col gap-1 border-[1px] border-t-1 px-4">
                <div className="flex items-center justify-between font-titleFont">
                  <h2 className="uppercase text-lg text-primeColor font-bold">
                    {product._source.searchResultData.name}
                  </h2>
                </div>
                <p className="text-[#767676] text-[14px] font-bold">
                  {numeral(product._source.searchResultData.price).format(
                    "0,0"
                  )}
                  VNĐ
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          pageCount={Math.ceil(totalResults / itemsPerPage)}
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
  );
};

export default SearchProduct;
