import React from "react";
import Banner from "../../components/Banner/Banner";
import BannerBottom from "../../components/Banner/BannerBottom";
import Sale from "../../components/home/Sale/Sale";
import YearProduct from "../../components/home/YearProduct/YearProduct";
import New from "../../components/pageProps/shopPage/New";
import BestSeller from "../../components/pageProps/shopPage/BestSeller";
import Hot from "../../components/pageProps/shopPage/Hot";
import BannerMini from "../../components/designLayouts/BannerMini";
import Title from "../../components/designLayouts/Title";
const Home = () => {
  return (
    <div className="w-full mx-auto">
      <Title title={"Trang chủ - JEANO Store"} />
      <BannerMini />
      <Banner />
      <BannerBottom />
      <div className="max-w-container my-10 mx-auto p-5">
        <Sale />
        <BestSeller className="mb-20" />
        <Hot className="my-20" />
        <YearProduct className="my-10" />
        <New />
      </div>
    </div>
  );
};

export default Home;
