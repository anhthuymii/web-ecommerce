import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axios from "axios";
import toast from "react-hot-toast";
import { MdOutlineCreate } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import ConfirmationModal from "../../components/designLayouts/ConfirmationModal";
import ReactPaginate from "react-paginate";
import Title from "../../components/designLayouts/Title";

const ROWS_PER_PAGE = 12;
const GetUser = () => {
  const [prevLocation, setPrevLocation] = useState("");
  const [users, setUsers] = useState([]);
  const [userDelete, setUserDelete] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [pagination, setPagination] = useState({
    first: 0,
    rows: ROWS_PER_PAGE,
    page: 1,
    pageCount: 0,
    totalRecords: 0,
  });
  const handleDeleteConfirmation = (user) => {
    setUserDelete(user);
    setShowDeleteConfirmation(true);
  };

  const handlePageClick = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    setPage(newPage);
  };

  const getUsers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/users?page=${page}&limit=${limit}`
      );
      setUsers(data.users);
      setPagination({
        ...pagination,
        pageCount: Math.ceil(data.total / ROWS_PER_PAGE),
        totalRecords: data.total,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra");
    }
  };
  useEffect(() => {
    // Fetch all products when the component mounts
    getUsers();
  }, [page]);

  const handleDelete = async (Id) => {
    try {
      const Id = userDelete._id;
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/auth/delete-user/${Id}`
      );
      if (data.success) {
        toast.success("Xóa người dùng thành công");
        setShowDeleteConfirmation(false);
        navigate("/dashboard/admin/users", { state: location?.pathname });
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
      <Title title={"Quản lý người dùng - JEANO Store"} />
      <Sidebar />
      <div className="flex flex-col space-y-6 py-1 px-2">
        <div>
          <Breadcrumbs title="Quản lý người dùng" prevLocation={prevLocation} />
        </div>
        <div className="relative w-full rounded xl:w-12/12 px-1">
          <div className="block bg-transparent mx-4 overflow-x-auto">
            <div className="flex flex-wrap">
              <table className="border-separate border border-slate-400 mt-2 ...">
                <thead>
                  <tr className="bg-black text-white border">
                    <th className="text-md px-2 md:px-6 py-3">STT</th>
                    <th className="text-md px-2 md:px-6 py-3">Họ và tên</th>
                    <th className="text-md px-2 md:px-6 py-3">Email</th>
                    <th className="text-md px-2 md:px-6 py-3">Số điện thoại</th>
                    <th className="text-md px-2 md:px-6 py-3">Chỉnh sửa</th>
                    <th className="text-md px-2 md:px-6 py-3">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr key={u._id}>
                      <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                        {index + 1}
                      </td>
                      <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                        {u.name}
                      </td>
                      <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                        {u.email}
                      </td>
                      <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                        {u.phone}
                      </td>
                      <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                        <MdOutlineCreate
                          size={25}
                          // onClick={() => handleUpdateProduct(p.slug)}
                        />
                      </td>
                      <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                        <AiFillDelete
                          size={25}
                          onClick={() => handleDeleteConfirmation(u)}
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
                message={`Bạn có chắc chắn muốn xóa người dùng này không ?`}
                onConfirm={() => handleDelete(userDelete._id)}
                onCancel={() => setShowDeleteConfirmation(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetUser;
