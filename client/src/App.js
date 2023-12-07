import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  ScrollRestoration,
} from "react-router-dom";
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";
import About from "./pages/About/About";
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import Cart from "./pages/Cart/Cart";
import Home from "./pages/Home/Home";
import Payment from "./pages/payment/Payment";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shop from "./pages/Shop/Shop";
import PrivateRoute from "./components/Routes/PrivateRoute";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import GetUser from "./pages/Admin/GetUser";
import GetOrder from "./pages/Admin/GetOrder";
import UserDashboard from "./pages/User/UserDashboard";
import UserOrder from "./pages/User/UserOrder";
import ForgotPassword from "./pages/Account/ForgotPassword";
import SearchProduct from "./pages/Search/SearchProduct";
import Category from "./components/home/Category/Category";
import CategoryProduct from "./components/home/Category/CategoryProduct";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import UpdateUser from "./pages/User/UpdateUser";
import Loading from "./components/designLayouts/Loading/Loading";
import { useLoading } from "./hooks/useLoading";
import { useEffect } from "react";
import { setLoadingInterceptor } from "./interceptors/loadingInterceptor"; // Import as named export
import AuthRoute from "./components/Routes/AuthRoutes";
import Checkout from "./pages/Checkout/Checkout";
import Notfound from "./pages/Notfound/Notfound";
import OrderTrack from "./pages/Checkout/OrderTrack";
import OrderDetails from "./pages/User/OrderDetails";
import UpdateOrder from "./pages/Admin/UpdateOrder";
import ListUnconfirm from "./pages/Admin/orderStatus/ListUnconfirm";
import ListConfirm from "./pages/Admin/orderStatus/ListConfirm";
import ListDone from "./pages/Admin/orderStatus/ListDone";
import ListCancel from "./pages/Admin/orderStatus/ListCancel";
import ListDelivery from "./pages/Admin/orderStatus/ListDelivery";
import OrderUnconfirm from "./pages/User/orderStatus/OrderUnconfirm";
import OrderConfirm from "./pages/User/orderStatus/OrderConfirm";
import OrderDone from "./pages/User/orderStatus/OrderDone";
import OrderCancel from "./pages/User/orderStatus/OrderCancel";
import OrderDelivery from "./pages/User/orderStatus/OrderDelivery";
import InfoAdmin from "./pages/Admin/InfoAdmin";
import UpdateAdmin from "./pages/Admin/UpdateAdmin";
import BestSellersProduct from "./components/home/Category/BestSellersProduct";
import HotProduct from "./components/home/Category/HotProduct";
import NewProduct from "./components/home/Category/NewProduct";
import { Helmet } from "react-helmet";
import UserReview from "./pages/User/UserReview/UserReview";
import GetReviews from "./pages/Admin/Review/GetReviews";

const Layout = ({ title, description, keywords, author, children }) => {
  const { showLoading, hideLoading } = useLoading();
  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading });
  }, []);

  return (
    <div>
      <Helmet>
        <meta charSet="uft-8" />
        <div>
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
        </div>
        <title>{title}</title>
      </Helmet>
      <Loading />
      <Header />
      <HeaderBottom />
      <SpecialCase />
      <ScrollRestoration />
      <Outlet />
      {/*<Toaster />*/}
      <Footer />
      <FooterBottom />
    </div>
  );
};
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        {/* ==================== Header Navlink Start here =================== */}
        <Route index element={<Home />}></Route>
        <Route path="/search/:keyword" element={<SearchProduct />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user/profile" element={<UserDashboard />} />
          <Route path="user/reviews" element={<UserReview />} />
          <Route path="user/orders" element={<UserOrder />} />
          <Route path="user/orders/unconfirm" element={<OrderUnconfirm />} />
          <Route path="user/orders/confirm" element={<OrderConfirm />} />
          <Route path="user/orders/done" element={<OrderDone />} />
          <Route path="user/orders/delivery" element={<OrderDelivery />} />
          <Route path="user/orders/cancel" element={<OrderCancel />} />
          <Route path="user/order/:id" element={<OrderDetails />} />
          <Route path="user/update-user" element={<UpdateUser />} />
        </Route>
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/info" element={<InfoAdmin />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/product/:slug" element={<UpdateProduct />} />
          <Route path="admin/users" element={<GetUser />} />
          <Route path="admin/reviews" element={<GetReviews />} />
          <Route path="admin/orders" element={<GetOrder />} />
          <Route path="admin/update-admin" element={<UpdateAdmin />} />
          <Route path="admin/orders/unconfirm" element={<ListUnconfirm />} />
          <Route path="admin/orders/confirm" element={<ListConfirm />} />
          <Route path="admin/orders/done" element={<ListDone />} />
          <Route path="admin/orders/cancel" element={<ListCancel />} />
          <Route path="admin/orders/delivery" element={<ListDelivery />} />
          <Route
            path="admin/order/update-order/:id"
            element={<UpdateOrder />}
          />
        </Route>
        <Route path="/shop" element={<Shop />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="*" element={<Notfound />} />
        {/* ==================== Header Navlink End here ===================== */}
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/best-seller" element={<BestSellersProduct />} />
        <Route path="/hot" element={<HotProduct />} />
        <Route path="/new" element={<NewProduct />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/checkout" element={<Checkout />}></Route>
        <Route path="/paymentgateway" element={<Payment />}></Route>
        <Route
          path="/track/:orderId"
          element={
            <AuthRoute>
              <OrderTrack />
            </AuthRoute>
          }
        />
      </Route>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
    </Route>
  )
);

function App() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
