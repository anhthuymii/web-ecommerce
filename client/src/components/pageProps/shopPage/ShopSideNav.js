import React, { useState } from "react";
// import Color from "./shopBy/Color";
// import Price from "./shopBy/Price";

const ShopSideNav = ({ onCategoryFilter, onPriceFilter }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  // Inside the ShopSideNav component, before the component definition
  const checkedCategories = [];
  const allProducts = [];

  const isProductInPriceRange = (product, priceRange) => {
    // Implement your logic to check if the product's price is within the selected range
    const productPrice = product.price; // Replace 'price' with the actual property of your product object
    return productPrice >= priceRange[0] && productPrice <= priceRange[1];
  };

  // Inside the ShopSideNav component
  const handleApplyFilters = () => {
    onCategoryFilter(selectedCategories);
    onPriceFilter(selectedPriceRange);
  };

  // Inside the Shop component
  return (
    <div className="w-full flex flex-col gap-6">
      {/*   <Price onPriceFilter={onPriceFilter} />
       */}{" "}
    </div>
  );
};

export default ShopSideNav;
