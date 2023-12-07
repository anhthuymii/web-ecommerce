import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import axios from "axios";
import numeral from "numeral";
import Title from "../../components/designLayouts/Title";
import ReviewProduct from "../Review/ReviewProduct";
const ProductDetails = () => {
  const navigate = useNavigate();
  const [prevLocation, setPrevLocation] = useState("");
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState({});
  const [productInfo, setProductInfo] = useState({});
  const params = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);

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
      console.log("Product Data:", data);

      setProduct(data?.product);
      getReviews(data?.product._id);
      getSimilarProduct(data?.product._id, data?.product.category?._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const getReviews = async (productId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/review/get-product-reviews/${productId}`
      );
      console.log("Product Data:", response);

      const { success, reviews, message } = response.data;

      if (success) {
        setReviews(reviews);
      } else {
        console.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <Title title={"Chi tiết sản phẩm - JEANO Store"} />
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          <div className="h-full">
            <h3 className="font-titleFont uppercase text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
              Gợi Ý Sản Phẩm
            </h3>
            <div className="w-full">
              {relatedProducts.length < 1 && (
                <p className="text-center">Không tìm thấy sản phẩm tương tự</p>
              )}
              <div className="flex flex-col gap-2">
                {relatedProducts?.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-4 border-b-[1px] border-b-gray-300 py-2"
                    onClick={() =>
                      navigate(`/product/${p.slug}`, { state: { product: p } })
                    }
                  >
                    <div>
                      <img
                        className="w-24 h-24"
                        src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                      />
                    </div>
                    <div className="flex flex-col gap-2 font-titleFont">
                      <p className="text-base font-medium">{p.name}</p>
                      <p className="text-sm font-semibold">
                        {numeral(p?.price).format("0,0")} VNĐ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>{" "}
          </div>
          <div className="h-full xl:col-span-2">
            <img
              className="w-full h-full object-cover"
              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
              alt={product.name}
            />
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={productInfo} />
          </div>
        </div>
        <div>
          <ReviewProduct reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
