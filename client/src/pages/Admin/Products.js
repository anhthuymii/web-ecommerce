import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import numeral from "numeral";
import Image from "../../components/designLayouts/Image";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { MdOutlineCreate } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import ConfirmationModal from "../../components/designLayouts/ConfirmationModal";
import { GiConfirmed } from "react-icons/gi";
import { FaShippingFast, FaSearch, FaPlus } from "react-icons/fa";
import { BsUiChecks, BsClipboardCheckFill } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import QuantityProduct from "../../components/designLayouts/Chart/QuantityProduct";
import Title from "../../components/designLayouts/Title";
const ROWS_PER_PAGE = 12;

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [prevLocation, setPrevLocation] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [search, setSearch] = useState(null);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [sellingProductsCount, setSellingProductsCount] = useState(0);
  const [outOfStockProductsCount, setOutOfStockProductsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const [pagination, setPagination] = useState({
    first: 0,
    rows: ROWS_PER_PAGE,
    page: 1,
    pageCount: 0,
    totalRecords: 0,
  });
  const handleFilterSelect = (filter) => {
    setPage(1); // Reset page when filter changes
    setActiveFilter(filter);
  };
  const handleDeleteConfirmation = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirmation(true);
  };

  const handlePageClick = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    setPage(newPage);
  };

  const fetchProducts = async () => {
    try {
      let apiUrl = `${process.env.REACT_APP_API}/api/v1/product/get-product?page=${page}&limit=${limit}`;

      if (search) {
        apiUrl += `&search=${search.toLowerCase()}`;
      }
      if (activeFilter === "active") {
        apiUrl += "&active=true";
      } else if (activeFilter === "outOfStock") {
        apiUrl += "&outOfStock=true";
      }
      const { data } = await axios.get(apiUrl);
      const totalProducts = data.total;
      const sellingProducts = data.products.filter(
        (p) => p.quantity > 0 && p.tag !== "SOLD OUT"
      );
      const outOfStockProducts = data.products.filter(
        (p) => p.quantity === 0 || p.tag === "SOLD OUT"
      );

      setProducts(data.products);
      setTotalProductsCount(totalProducts);
      setSellingProductsCount(sellingProducts.length);
      setOutOfStockProductsCount(outOfStockProducts.length);
      setPagination({
        ...pagination,
        pageCount: Math.ceil(data.total / ROWS_PER_PAGE),
        totalRecords: data.total,
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page, limit]);

  const onPage = (event) => {
    setPagination({
      ...pagination,
      first: event.first,
      rows: event.rows,
      page: event.page + 1,
    });
  };

  const handleUpdateProduct = (productSlug) => {
    navigate(`/dashboard/admin/product/${productSlug}`);
  };

  //delete a product
  const handleDelete = async (pId) => {
    try {
      const pId = productToDelete._id;
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/product/delete-product/${pId}`
      );
      if (data.success) {
        toast.success("Xóa sản phẩm thành công");
        setShowDeleteConfirmation(false);
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Title title={"Quản lý sản phẩm - JEANO Store"} />
      <Sidebar />
      <div className="flex flex-col space-y-6 py-1 px-1">
        <div>
          <Breadcrumbs title="Quản lý sản phẩm" prevLocation={prevLocation} />
        </div>
        <div className="relative w-full rounded xl:w-12/12 px-1">
          <div className="block bg-transparent mx-4 overflow-x-auto">
            <QuantityProduct onSelectFilter={handleFilterSelect} />
            <div className="flex flex-row pt-2 relative mx-auto text-gray-600">
              <div className="relative">
                <input
                  className="border-2 border-gray-300 bg-white h-10 px-10 pr-10 rounded-lg text-sm focus:outline-none"
                  type="search"
                  name="search"
                  placeholder="Tìm kiếm sản phẩm"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="absolute left-3 top-2">
                  <FaSearch className="my-1" />
                </button>
              </div>
              <div
                onClick={() => {
                  navigate("/dashboard/admin/create-product");
                }}
                className="mx-2 p-2 rounded-lg bg-primeColor w-[150px] h-[35px] text-white flex justify-center items-center text-sm font-semibold hover:bg-black duration-300 cursor-pointer"
              >
                <FaPlus /> Thêm sản phẩm
              </div>
            </div>
            <div className="flex flex-wrap">
              <table className="border-separate border border-slate-400 mt-2 ...">
                <thead>
                  <tr className="bg-black text-white border">
                    <th className="text-md px-2 md:px-6 py-3">Tên sản phẩm</th>
                    <th className="text-md px-2 md:px-6 py-3">Giá</th>
                    <th className="text-md px-2 md:px-6 py-3">Số lượng</th>
                    <th className="text-md px-2 md:px-6 py-3">Tag</th>
                    <th className="text-md px-2 md:px-6 py-3">Hình ảnh</th>
                    <th className="text-md px-2 md:px-6 py-3">Chỉnh sửa</th>
                    <th className="text-md px-2 md:px-6 py-3">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter((p) => {
                      return (
                        !search ||
                        p.name.toLowerCase().includes(search.toLowerCase())
                      );
                    })
                    .map((p) => (
                      <tr key={p._id}>
                        <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                          {p.name}
                        </td>
                        <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                          {numeral(p?.price).format("0,0")} VNĐ
                        </td>
                        <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                          {p.quantity}
                        </td>
                        <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                          <div className="rounded text-center py-1 px-3 bg-black text-white">
                            {p.tag}
                          </div>
                        </td>
                        <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                          <Image
                            className="w-20 h-20 md:w-34 md:h-34 object-cover"
                            imgSrc={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                            alt={p.name}
                          />
                        </td>
                        <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                          <MdOutlineCreate
                            size={25}
                            onClick={() => handleUpdateProduct(p.slug)}
                          />
                        </td>
                        <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                          <AiFillDelete
                            size={25}
                            onClick={() => handleDeleteConfirmation(p)}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
              <ReactPaginate
                pageCount={pagination.pageCount}
                onPageChange={handlePageClick}
                containerClassName="flex justify-center items-center text-base font-semibold font-titleFont py-10"
                activeClassName="bg-black text-white"
                pageLinkClassName="w-9 justify-center items-center h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
                pageClassName="m-4"
                previousLabel="<"
                nextLabel=">"
              />
            </div>
            {showDeleteConfirmation && (
              <ConfirmationModal
                message={`Bạn có chắc chắn muốn xóa sản phẩm này không ?`}
                onConfirm={() => handleDelete(productToDelete._id)}
                onCancel={() => setShowDeleteConfirmation(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
