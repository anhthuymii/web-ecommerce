import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import axios from "axios";

const Pagination = ({ itemsPerPage }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/product/get-product?page=${page}&limit=${limit}`
        );
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit]);

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1; // Pages are usually 1-indexed
    setPage(selectedPage);
  };

  const itemOffset = (page - 1) * itemsPerPage;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  return (
    <div>
      <div className="grid grid-cols-1 gap-10 mdl:gap-4 lg:gap-10">
        {loading && <p>Loading...</p>}
        {error && <p>Error fetching data.</p>}
        <Items currentItems={currentItems} />
      </div>
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        />

        <p className="text-base font-normal text-lightText">
          Products from {itemOffset === 0 ? 1 : itemOffset + 1} to{" "}
          {endOffset} of {products.length}
        </p>
      </div>
    </div>
  );
};

const Items = ({ currentItems }) => {
  return (
    <>
      {currentItems.map((item) => (
        <div key={item._id} className="w-full">
          <Product
            _id={item._id}
            img={item.img}
            productName={item.productName}
            price={item.price}
            color={item.color}
            badge={item.badge}
            des={item.des}
          />
        </div>
      ))}
    </>
  );
};

export default Pagination;
