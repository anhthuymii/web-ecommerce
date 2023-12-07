import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { TbLocationSearch } from "react-icons/tb";
import { debounce } from "lodash";
import { useSearch } from "../../../context/search";
import { motion } from "framer-motion";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedSearch] = useState(() => debounce(searchProducts, 100));
  const [values, setValues] = useSearch();
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [show, setShow] = useState(false);
  const ref = useRef();

  const handleSearchBarClick = () => {
    setShow(!show);
    setShowResults(true);
  };

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setShow(false);
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [show]);

  let source = axios.CancelToken.source();

  async function searchProducts(query) {
    if (query) {
      try {
        source.cancel("Operation canceled due to new request.");
        source = axios.CancelToken.source();
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/search/${query}`,
          { cancelToken: source.token }
        );
        setSearchResults(data.result.hits.hits);
        setShowResults(true);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error(error);
          toast.error("Something went wrong");
        }
      }
    } else {
      setShowResults(false);
    }
  }

  const search = async () => {
    if (searchQuery) {
      try {
        setValues({ keyword: searchQuery });
        navigate(`/search/${searchQuery}`);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
      setSubmitted(true);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    search();
    debouncedSearch.cancel();
    searchProducts(searchQuery);
    setShow(false);
  };

  const handleSearchResultClick = (product) => {
    navigate(`/product/${product._source.searchResultData.slug}`, {
      state: {
        item: product._source.searchResultData._source,
      },
    });
    setSearchQuery("");
    setShow(false);
    setShowResults(false);
  };

  useEffect(() => {
    if (location.pathname !== "/search") {
      setShowResults(false);
    }
  }, [location]);

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        debouncedSearch.cancel(); // Cancel any ongoing debounce to ensure the latest search
        searchProducts(searchQuery);
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [searchQuery, debouncedSearch]);

  return (
    <div className="relative w-full lg:w-[550px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-4 rounded-xl">
      <form
        onClick={handleSearchBarClick}
        ref={ref}
        onSubmit={handleFormSubmit}
        className="relative w-full lg:w-[550px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-4 rounded-xl"
      >
        <input
          className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Nhập vào từ khóa để tìm kiếm sản phẩm"
        />
        <button type="submit" onClick={search}>
          <FaSearch className="w-5 h-5" />
        </button>
      </form>
      {show && (
        <motion.ul
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer"
        >
          {showResults && (
            <div className="w-full mx-auto h-96 bg-white absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer">
              {searchResults.map((product) => (
                <div
                  onClick={() => handleSearchResultClick(product)}
                  key={product._source.searchResultData._id}
                  className="flex max-w-[600px] h-16 px-3 bg-gray-100 mb-1 items-center gap-3"
                >
                  <div className="flex flex-row gap-1 flex-1 my-2">
                    <TbLocationSearch className="w-4 h-4 my-5 justify-center items-center " />
                    <div className="flex flex-col">
                      <p className="uppercase font-semibold text-base mx-2">
                        {product._source.searchResultData.name}
                      </p>
                      <p className="text-xs mx-2 text-gray-600">
                        Thể loại:{" "}
                        {product._source.searchResultData.category?.name ||
                          "N/A"}
                      </p>
                      <p className="text-xs mx-2 text-gray-600">
                        Nhãn hàng:{" "}
                        {product._source.searchResultData.brand || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-end px-3">
                    <img
                      className="w-12 h-14 rounded"
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._source.searchResultData._id}`}
                      alt={product._source.searchResultData.name}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.ul>
      )}
    </div>
  );
};

export default Search;
