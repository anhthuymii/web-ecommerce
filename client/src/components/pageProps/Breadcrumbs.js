import React, { useEffect, useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useLocation } from "react-router-dom";

const Breadcrumbs = ({ title }) => {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment);

  return (
    <div className="w-full px-5 pt-10 pb-5 xl:pt-10 xl:pb-5 flex flex-col gap-3">
      <h1 className="text-4xl uppercase text-primeColor font-titleFont font-bold">
        {title}
      </h1>
      <p className="text-sm font-normal text-lightText capitalize flex items-center">
        <span>Home</span>
        <span className="px-1">
          <HiOutlineChevronRight />
        </span>
        {pathSegments.map((segment, index) => (
          <React.Fragment key={segment}>
            <span className="capitalize font-semibold text-primeColor">
              {segment}
            </span>
            {index < pathSegments.length - 1 && (
              <span className="px-1">
                <HiOutlineChevronRight />
              </span>
            )}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
};

export default Breadcrumbs;
