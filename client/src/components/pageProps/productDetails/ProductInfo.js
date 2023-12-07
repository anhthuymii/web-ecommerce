import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import { useParams } from "react-router-dom";
import axios from "axios";
import numeral from "numeral";
import h2p from "html2plaintext";
import htmlFormat from "html-to-formatted-text";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const [product, setProduct] = useState({});
  const [sizeState, setSizeState] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const isSoldOut = product.tag === "SOLDOUT" || product.quantity === 0;
  let desc = h2p(product.description);
  desc = htmlFormat(desc);

  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = () => {
    if (sizeState) {
      dispatch(
        addToCart({
          _id: product._id,
          name: product.name,
          quantity: 1,
          image: `${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`,
          badge: product.tag,
          price: product.price,
          slug: product.slug,
          size: sizeState,
        })
      );
      setSizeState("");
      setWarningMessage("");
    } else {
      setWarningMessage(
        "Vui lòng chọn kích thước trước khi thêm vào giỏ hàng."
      );
    }
  };

  const sizesArray = product.size ? product.size.split(",") : [];

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{product.name}</h2>
      <p className="text-xl font-semibold">
        {numeral(product?.price).format("0,0")} VNĐ
      </p>
      <p className="font-medium text-lg">
        <span className="font-normal">Nhãn hàng:</span> {product.brand}
      </p>
      <p className="font-normal text-sm">
        <span className="text-base font-medium">
          Thể Loại: {product?.category?.name}
        </span>
      </p>

      <p className="font-normal text-sm">
        <span className="text-base font-medium">Mô tả: {desc}</span>
      </p>
      <hr />
      <p className="font-normal text-sm">
        <span className="text-base font-medium">Size: </span>
      </p>
      <div className="font-normal text-sm">
        {sizesArray.length > 0 &&
          sizesArray.map((size) => (
            <button
              key={size}
              onClick={() => setSizeState(size)}
              className={`rounded m-1 px-3 text-lg ${
                size === sizeState
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {size}
            </button>
          ))}
      </div>
      {warningMessage && <p className="text-red-500">{warningMessage}</p>}
      <div className="w-full sm:w-6/12 p-3"></div>
      {isSoldOut ? (
        <button
          className="w-full py-4 bg-gray-500 cursor-not-allowed text-white text-lg font-titleFont"
          disabled
        >
          Đã hết hàng
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          className="w-full py-4 bg-primeColor hover-bg-black duration-300 text-white text-lg font-titleFont"
        >
          Thêm vào giỏ hàng
        </button>
      )}
    </div>
  );
};

export default ProductInfo;
