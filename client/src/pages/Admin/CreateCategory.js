import React, { useEffect, useState } from "react";
import Sidebar, { SidebarItem } from "../../components/Layout/Sidebar";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { BiHome } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ConfirmationModal from "../../components/designLayouts/ConfirmationModal";
import { MdOutlineCreate } from "react-icons/md";
import Title from "../../components/designLayouts/Title";
const CreateCategory = () => {
  const [name, setName] = useState("");
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [updatedName, setUpdatedName] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [prevLocation, setPrevLocation] = useState("");

  const handleOnClose = () => setShowModal(false);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleDeleteConfirmation = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirmation(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category`,
        {
          name,
        }
      );
      if (data?.success) {
        toast.success(`${name} is created`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in input form");
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success(`Đã chỉnh sửa danh mục "${updatedName}" thành công`);
        setSelected(null);
        setUpdatedName("");
        setShowModal(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  //delete category
  const handleDelete = async (pId) => {
    try {
      const pId = categoryToDelete._id;
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/category/delete-category/${pId}`
      );
      if (data.success) {
        toast.success(`Đã xóa danh mục thành công`);
        setShowDeleteConfirmation(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-row">
      <Title title={"Quản lý danh mục - JEANO Store"} />
      <Sidebar />
      <div className="flex flex-col space-y-6 py-1 px-2">
        <div>
          <Breadcrumbs title="Danh mục sản phẩm" prevLocation={prevLocation} />
        </div>
        <div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="border-2 mx-2 border-black p-1 rounded-lg mb-2"
            placeholder="Tên danh mục"
          />
          <button
            className="rounded-md bg-black text-white p-2"
            onClick={handleSubmit}
          >
            Thêm danh mục
          </button>
        </div>
        <div className="relative w-full rounded xl:w-12/12 px-1">
          <div className="block bg-transparent mx-4 overflow-x-auto">
            <div className="flex flex-wrap">
              <table className="border-separate border border-slate-400 mt-2 ...">
                <thead>
                  <tr className="bg-black text-white border">
                    <th className="text-md px-2 md:px-6 py-3">STT</th>
                    <th className="text-md px-2 md:px-6 py-3">Tên danh mục</th>
                    <th className="text-md px-2 md:px-6 py-3">Chỉnh sửa</th>
                    <th className="text-md px-2 md:px-6 py-3">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c, index) => (
                    <tr key={c._id} className="border border-slate-300 ...">
                      <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                        {index + 1}
                      </td>
                      <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                        {c.name}
                      </td>
                      <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                        <MdOutlineCreate
                          size={25}
                          onClick={() => {
                            setShowModal(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        />
                      </td>
                      <td className="border border-slate-300 ... text-md px-2 md:px-6 py-1">
                        <AiFillDelete
                          className="text-center justify-center items-center"
                          size={25}
                          onClick={() => {
                            handleDeleteConfirmation(c);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showDeleteConfirmation && (
              <ConfirmationModal
                message={`Bạn có chắc chắn muốn xóa danh mục này không ?`}
                onConfirm={() => handleDelete(categoryToDelete._id)}
                onCancel={() => setShowDeleteConfirmation(false)}
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        handleSubmit={handleUpdate}
        name={updatedName}
        setName={setUpdatedName}
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
      {showDeleteConfirmation && (
        <ConfirmationModal
          message={`Bạn có chắc chắn muốn xóa danh mục này không ?`}
          onConfirm={() => handleDelete(categoryToDelete._id)}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
};

const Modal = ({ handleSubmit, name, setName, visible, onClose }) => {
  if (!visible) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-black bg-opacity-30 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-5 rounded relative m-5">
          <AiOutlineClose
            className="absolute top-3 right-5"
            onClick={handleClose}
          />
          <p className="text-base mt-3 font-semibold leading-6 text-gray-900">
            Chỉnh sửa danh mục
          </p>
          <p>Tên danh mục</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="border-2 border-black p-1 rounded-lg mb-2"
          />
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              className="inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black sm:ml-3 sm:w-auto"
              onClick={handleSubmit}
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
