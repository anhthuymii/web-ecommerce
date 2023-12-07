import React from "react";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

const Card = () => {
  return (
    <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
      <div
        icon={<MdBarChart className="h-7 w-7" />}
        title={"Earnings"}
        subtitle={"$340.5"}
      />
      <div
        icon={<IoDocuments className="h-6 w-6" />}
        title={"Spend this month"}
        subtitle={"$642.39"}
      />
      <div
        icon={<MdBarChart className="h-7 w-7" />}
        title={"Sales"}
        subtitle={"$574.34"}
      />
      <div
        icon={<MdDashboard className="h-6 w-6" />}
        title={"Your Balance"}
        subtitle={"$1,000"}
      />
      <div
        icon={<MdBarChart className="h-7 w-7" />}
        title={"New Tasks"}
        subtitle={"145"}
      />
      <div
        icon={<IoMdHome className="h-6 w-6" />}
        title={"Total Projects"}
        subtitle={"$2433"}
      />
    </div>
  );
};

export default Card;
