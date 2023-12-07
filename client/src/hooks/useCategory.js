import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  //get cat
  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      setCategories(data?.category);
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi lấy danh mục");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}
