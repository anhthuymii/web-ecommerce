import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Badge = ({ text }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/product/get-product`
        );
        setProducts(data.products);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    };

    getAllProducts();
  }, []);
  return (
    <div className="bg-primeColor w-[92px] h-[35px] text-white flex justify-center items-center text-base font-semibold hover:bg-black duration-300 cursor-pointer">
      {products.tag}
    </div>
  );
};

export default Badge;
