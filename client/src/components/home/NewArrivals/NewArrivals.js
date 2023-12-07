import React from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";

const NewArrivals = () => {
 
  return (
    <div className="w-full pb-16">
      <Heading heading="New Arrivals" />
      <Slider>
        <div className="px-2">
          <Product />
        </div>
      </Slider>
    </div>
  );
};

export default NewArrivals;
