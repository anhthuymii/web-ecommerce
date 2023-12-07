import React from "react";
import { Link } from "react-router-dom";
import banner3 from "../../../assets/images/banner/image1.jpg";
import tuixach from "../../../assets/images/banner/cate3.jpg";
import aothun from "../../../assets/images/banner/cate2.jpg";
import vay from "../../../assets/images/banner/cate4.jpg";
import Image from "../../designLayouts/Image";

const Sale = () => {
  return (
    <div className="py-20 flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-10">
      <div className="w-full md:w-2/3 lg:w-1/2 h-full relative">
        <Link to="/category/ao-thun" className="relative block">
          <Image
            className="h-full w-full object-cover hover:bg-black hover:text-white hover:p-20"
            imgSrc={aothun}
          />
          <div className="text-xl uppercase font-titleFont font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white p-4 bg-black bg-opacity-50">
            áo thun
          </div>
        </Link>
      </div>
      <div className="w-full md:w-2/3 lg:w-1/2 h-auto flex flex-col gap-4 lg:gap-10">
        <div className="h-1/2 w-full relative ">
          <Link to="/category/tui-xach" className="relative block">
            <Image
              className="h-full w-full object-cover hover:bg-black hover:text-white hover:p-20"
              imgSrc={tuixach}
            />
            <div className="text-xl uppercase font-titleFont font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white p-4 bg-black bg-opacity-50">
              túi xách
            </div>
          </Link>
        </div>
        <div className="h-1/2 w-full relative">
          <Link to="/category/vay" className="relative block">
            <Image
              className="h-full w-full object-cover  hover:bg-black hover:text-white hover:p-20"
              imgSrc={vay}
            />
            <div className="text-xl uppercase font-titleFont font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white p-4 bg-black bg-opacity-50">
              váy
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sale;
