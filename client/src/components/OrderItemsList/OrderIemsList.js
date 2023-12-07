import React from "react";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";

const OrderIemsList = ({ item, onSelectSize }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full mb-4 border py-2">
      <div className="flex mx-5 flex-col md:flex-row items-center md:items-start justify-between px-4 md:px-0">
        <div className="mb-2 md:mb-0">
          <img
            className="w-24 h-24 rounded border"
            src={item.image}
            alt={item.name}
          />
        </div>
        <div className="flex-1 md:ml-4">
          <h1 className="font-semibold uppercase my-5">{item.name}</h1>
          <p className="font-semibold mt-2">Size {item.size}</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-0 mt-2">
        <div className="flex mx-5 w-full md:w-1/3 items-center text-sm font-semibold">
          {numeral(item?.price).format("0,0")} VNĐ
        </div>
        <p>x {item.quantity}</p>
        <div className="flex w-full md:w-1/3 items-center font-black text-base mt-2 md:mt-0">
          <p> {numeral(item.quantity * item.price).format("0,0")} VNĐ</p>
        </div>
      </div>
    </div>
  );
};

export default OrderIemsList;
