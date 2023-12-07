import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const QuantityProduct = ({ onSelectFilter }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeProducts, setActiveProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`),
        ]);

        setLoading(false);

        const productsData = productsResponse.data.products;

        const activeProducts = productsData.filter(
          (product) => product.tag !== "SOLDOUT" && product.quantity > 0
        );

        const outOfStockProducts = productsData.filter(
          (product) => product.tag === "SOLDOUT" || product.quantity === 0
        );

        setProducts(productsData); // Set all products
        setActiveProducts(activeProducts);
        setOutOfStockProducts(outOfStockProducts);
      } catch (error) {
        console.error("Có lỗi xảy ra:", error);
        toast.error("Có lỗi xảy ra");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-2 justify-center items-center text-center">
      <div
        onClick={() => onSelectFilter(null)}
        className="flex-1 md:w-1/3 bg-primeColor hover:bg-black text-white group rounded-md p-5 ring-1 ring-slate-200 shadow-sm"
      >
        <div className="grid sm:block lg:grid xl:block items-center">
          <p className="group-hover:text-white font-bold text-lg text-white">
            Tổng số sản phẩm
          </p>
          <p className="group-hover:text-white">{products.length} sản phẩm</p>
        </div>
      </div>

      <div className="flex-1 md:w-1/3 mx-3 bg-primeColor hover:bg-black text-white group rounded-md p-5 ring-1 ring-slate-200 shadow-sm">
        <div
          onClick={() => onSelectFilter("active")} // Clicking on active products
          className="grid sm:block lg:grid xl:block items-center"
        >
          <p className="group-hover:text-white font-bold text-lg text-white">
            Sản phẩm đang bán
          </p>
          <p className="group-hover:text-white">
            {activeProducts.length} sản phẩm
          </p>
        </div>
      </div>

      <div className="flex-1 md:w-1/3 bg-primeColor hover:bg-black text-white group rounded-md p-5 ring-1 ring-slate-200 shadow-sm">
        <div
          onClick={() => onSelectFilter("outOfStock")} // Clicking on out of stock products
          className="grid sm:block lg:grid xl:block items-center"
        >
          <p className="group-hover:text-white font-bold text-lg text-white">
            Sản phẩm hết hàng
          </p>
          <p className="group-hover:text-white">
            {outOfStockProducts.length} sản phẩm
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuantityProduct;
