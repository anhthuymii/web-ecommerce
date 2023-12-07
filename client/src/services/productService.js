import axios from "axios";

export const search = async (searchTerm) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/search/` + searchTerm);
  return data;
};
