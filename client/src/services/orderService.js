import axios from "axios";

export const createOrder = async (order) => {
  try {
    const { data } = axios.post(
      `${process.env.REACT_APP_API}/api/v1/order/create-order`,
      order
    );
    return data;
  } catch (error) {}
};

export const getNewOrderForCurrentUser = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/order/getNewOrderForCurrentUser`);
  return data;
};

export const pay = async paymentId => {
  try{
    const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/order/pay`, {paymentId});
    return data;
  }
  catch(err){}
};

