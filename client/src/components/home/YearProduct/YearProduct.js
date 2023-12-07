import React from "react";
import { Link } from "react-router-dom";
import productOfTheYear from "../../../assets/images/banner/img7.jpg";
import ShopNow from "../../designLayouts/buttons/ShopNow";
import Image from "../../designLayouts/Image";

const YearProduct = () => {
  return (
    <Link to={"/about"}>
      <div className="w-full h-80 my-10 bg-[#f3f3f3] md:bg-transparent relative font-titleFont">
        <Image
          className="w-full h-full object-cover hidden md:inline-block"
          imgSrc={productOfTheYear}
        />
        <div className="w-full md:w-2/3 px-10 xl:w-1/2 h-80 absolute md:px-0 top-0 left-0 flex flex-col items-start gap-6 justify-center">
          <h1 className="text-3xl px-20 font-title font-bold text-primeColor">
            JEANO Store
          </h1>
          <p className="text-base font-normal text-primeColor max-w-[600px] px-20 ml-8">
            New Fashion - New Style
          </p>
          <p className="text-base font-normal text-primeColor max-w-[600px] px-20 ml-24">
            - New JEANO
          </p>
          <ShopNow />
        </div>
        {/*<div className="w-full md:w-2/3 px-10 xl:w-1/2 h-80 absolute md:px-0 top-0 right-0 flex flex-col items-start gap-6 justify-center">
          <h1 className="text-3xl font-title font-bold text-primeColor">
            JEANO Store
          </h1>
          <p className="text-base font-normal text-primeColor max-w-[600px]  mr-8">
            New Fashion - New Style
          </p>
          <p className="text-base font-normal text-primeColor max-w-[600px]  mr-24">
            - New JEANO
          </p>
          <ShopNow />
  </div>*/}
      </div>
    </Link>
  );
};

export default YearProduct;
