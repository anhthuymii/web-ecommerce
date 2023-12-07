import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderIemsList from "../../components/OrderItemsList/OrderIemsList";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createOrder } from "../../services/orderService";
import { useAuth } from "../../context/auth";
import { MdOutlineCreate } from "react-icons/md";
import { PayPalButton } from "react-paypal-button-v2";
import * as paymentService from "../../services/paymentService";
import PayButton from "../../components/Payment/PayButton";
import UpdateAddressShip from "./updateAddressShip";
import axios from "axios";
import Title from "../../components/designLayouts/Title";
const Checkout = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const [totalAmt, setTotalAmt] = useState("");
  const navigate = useNavigate();
  const [shippingCharge, setShippingCharge] = useState("");
  const [auth] = useAuth();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [detail, setDetail] = useState("");
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [isPaymentSelected, setIsPaymentSelected] = useState(false);
  const [update, setUpdate] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [addressDetails, setAddressDetails] = useState({});
  const [warningMessage, setWarningMessage] = useState("");

  const handleUpdate = (user) => {
    setUpdate(user);
    setShowUpdate(true);
  };

  useEffect(() => {
    let price = 0;
    products.map((item) => {
      price += item.price * item.quantity;
      return price;
    });
    setTotalAmt(price);
  }, [products]);

  useEffect(() => {
    let shippingCharge = 0;
    if (totalAmt < 500000) {
      shippingCharge = 30000;
    } else if (totalAmt >= 500000 && totalAmt < 1000000) {
      shippingCharge = 25000;
    } else {
      shippingCharge = 20000;
    }
    setShippingCharge(shippingCharge);
  }, [totalAmt]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  console.log("user: ", auth.user);
  const [payment, setPayment] = useState("COD");
  const handlePayment = (e) => {
    setPayment(e.target.value);
    setIsPaymentSelected(true);
  };

  useEffect(() => {
    let price = 0;
    products.map((item) => {
      if (item.price) {
        price += item.price * item.quantity;
      }
      return price;
    });
    setTotalAmt(price);
  }, [products]);

  const {
    // register,
    // formState: { errors },
    handleSubmit,
  } = useForm();

  const submit = async (formData) => {
    if (!isPaymentSelected) {
      setWarningMessage("Xin hãy chọn phương thức thanh toán.");
      return;
    }
    if (auth.user && auth.user.id) {
      await getUser();

      const { city, commune, detail, district } = addressDetails;

      const validItems = products.map((item) => ({
        product: item._id,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        name: item.name,
        slug: item.slug,
        photo: `${process.env.REACT_APP_API}/api/v1/product/product-photo/${item._id}`,
      }));

      const orderData = {
        products: validItems,
        orderby: auth.user.id,
        name: auth.user.name,
        phone: auth.user.phone,
        address: {
          city: addressDetails.city,
          commune: addressDetails.commune,
          detail: addressDetails.detail,
          district: addressDetails.district,
        },
        totalPrice: totalAmt + shippingCharge,
        paymentIntent: payment,
        itemsPrice: totalAmt,
        shippingPrice: shippingCharge,
      };

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/order/create-order`,
          orderData
        );
        // createOrder(orderData);
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/dashboard/user/orders");
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Lỗi xảy ra khi tạo đơn hàng");
      }
      setWarningMessage("");
    } else {
      setWarningMessage(
        "Vui lòng chọn kích thước trước khi thêm vào giỏ hàng."
      );
    }
  };

  const onSuccessPaypal = async (details, data) => {
    if (auth.user && auth.user.id) {
      const validItems = products.map((item) => ({
        product: item._id,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        name: item.name,
        slug: item.slug,
        photo: `${process.env.REACT_APP_API}/api/v1/product/product-photo/${item._id}`,
      }));

      const orderData = {
        products: validItems,
        orderby: auth.user.id,
        name: auth.user.name,
        phone: auth.user.phone,
        address: {
          city: addressDetails.city,
          commune: addressDetails.commune,
          detail: addressDetails.detail,
          district: addressDetails.district,
        },
        totalPrice: totalAmt + shippingCharge,
        paymentIntent: payment,
        itemsPrice: totalAmt,
        shippingPrice: shippingCharge,
      };

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/order/create-order`,
          orderData
        );
        // createOrder(orderData);
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/dashboard/user/orders");
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Lỗi xảy ra khi tạo đơn hàng");
      }
    }
    console.log("details, data", details, data);
  };

  const [sdkReady, setSdkReady] = useState(false);
  const addPaypalScript = async () => {
    const { data } = await paymentService.getConfig();
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
    console.log("data: ", data);
  };

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  const [user, setUser] = useState("");

  const getUser = async () => {
    try {
      // if (auth.user && auth.user.id) {
      const userId = auth?.user?.id;
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/user/${userId}`
      );
      const userData = response.data.user;
      if (userData.address) {
        const { city, commune, detail, district } = userData.address;

        setAddressDetails({
          city,
          commune,
          detail,
          district,
        });
        console.log(userData.address);
      }
      setUser(userData);
      setId(userData.id);
      setName(userData.name);
      setPhone(userData.phone);
      setEmail(userData.email);
      setCommunes(userData.address.communes);
      setCity(userData.address.city);
      setDetail(userData.address.detail);
      setDistricts(userData.address.districts);
      // }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (auth.user?.id) {
      getUser();
    }
  }, [auth.user?.id]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Title title={"Thanh toán - JEANO Store"} />
      <Breadcrumbs title="Đặt hàng & Thanh toán" />
      <div className="pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-base uppercase font-semibold tracking-tight text-gray-900 sm:text-2xl">
              Sản phẩm thanh toán
            </p>
            <div className="mt-3">
              {products.map((item) => (
                <div key={item._id}>
                  <OrderIemsList item={item} />
                </div>
              ))}
            </div>
            <div className="max-w-7xl gap-4 flex justify-end">
              <div className="w-96 uppercase flex flex-col ">
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-mx px-4 font-medium">
                  Tạm tính
                  <span className="font-semibold tracking-wide font-titleFont">
                    {formatCurrency(totalAmt)}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-mx px-4 font-medium">
                  Phí vận chuyển
                  <span className="font-semibold tracking-wide font-titleFont">
                    {formatCurrency(shippingCharge)}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-mx px-4 font-bold">
                  Tổng cộng
                  <span className="font-bold tracking-wide text-lg font-titleFont">
                    {formatCurrency(totalAmt + shippingCharge)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right side (Address form) */}
          <div className="isolate bg-white sm:py-5 lg:px-4">
            <div className="grow p-5 border rounded">
              <div className="relative p-3">
                <div className="flex text-xl font-bold">
                  <p className="text-xl uppercase font-bold mr-5">
                    Thông tin giao hàng
                  </p>
                </div>
                <div className="mt-2 space-y-2">
                  <div>
                    <strong>Tên tài khoản:</strong> {user.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div>
                    <strong>Số điện thoại:</strong> {user.phone}
                  </div>
                  {addressDetails.city && (
                    <div>
                      <strong>Địa chỉ: </strong>
                      {addressDetails.detail && addressDetails.detail},{" "}
                      {addressDetails.commune && `${addressDetails.commune}, `}
                      {addressDetails.district &&
                        `${addressDetails.district}, `}
                      {`${addressDetails.city} `}
                    </div>
                  )}
                  <div
                    className="text-lg font-bold underline"
                    onClick={() => handleUpdate(auth.user)}
                  >
                    Thêm địa chỉ mới
                  </div>
                </div>
              </div>
            </div>
            {showUpdate && (
              <UpdateAddressShip
                user={auth.user}
                order={update}
                onCancel={() => {
                  setShowUpdate(false);
                  setUpdate(null);
                }}
              />
            )}

            <div className="w-full mt-3 col-span-5 border px-3 py-3 items-center gap-5">
              <p className="text-xl uppercase font-bold">
                Phương thức thanh toán
              </p>
              <div onChange={handlePayment} value={payment}>
                <label className="flex items-center gap-2">
                  <input
                    // onClick={handleSubmit(submit)}
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    // className="form-radio"
                    className="form-checkbox accent-black md:accent-black text-primeColor"
                  />
                  Thanh toán trực tiếp
                </label>
                {/*<label className="flex items-center gap-2">
                  <input
                    // onClick={handleSubmit(submit)}
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    // className="form-radio"
                    className="form-checkbox accent-black md:accent-black text-primeColor"
                  />
                  Thanh toán Stripe
                </label>*/}
                <PayButton products={products} user={auth.user} />
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Paypal"
                    className="form-checkbox accent-black md:accent-black text-primeColor"
                  />
                  Thanh toán Paypal
                </label>
              </div>
            </div>
            {warningMessage && <p className="text-red-500">{warningMessage}</p>}
            <div className="mt-3">
              {payment === "Paypal" && sdkReady ? (
                <div>
                  <PayPalButton
                    amount={totalAmt + shippingCharge}
                    onSuccess={onSuccessPaypal}
                    onError={() => {
                      alert("Error");
                    }}
                  />
                  {/*<PaypalButton order={order} />*/}
                </div>
              ) : (
                <button
                  className="w-full uppercase h-10 bg-primeColor text-white hover-bg-black duration-300"
                  onClick={handleSubmit(submit)}
                  disabled={!isPaymentSelected}
                >
                  Đặt hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
