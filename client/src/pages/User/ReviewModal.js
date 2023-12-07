import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlineClose, AiOutlineDown } from "react-icons/ai";
import { Menu } from "@headlessui/react";

const ReviewModal = ({
  orderId,
  product,
  onCancel,
  onReviewSubmit,
  isReviewed,
}) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const status = ["1", "2", "3", "4", "5"];

  const [comment, setComment] = useState("");
  const [reviewPhoto, setReviewPhoto] = useState(null);

  const handleStarsChange = (stars) => {
    setSelectedStars(stars);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleFileChange = (e) => {
    setReviewPhoto(e.target.files[0]);
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!comment || !selectedStars || !product.id || !orderId) {
      toast.error("Vui lòng điền đầy đủ thông tin cần thiết.");
      return;
    }

    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("star", selectedStars);
    formData.append("reviewPhoto", reviewPhoto);
    formData.append("productId", product.id);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/review/create-product-review/${orderId}/${product.product}`,
        formData
      );

      if (response.data.success) {
        toast.success("Đánh giá đã được thêm thành công");
        onReviewSubmit();
        setSelectedStars(0);
        setComment("");
        setReviewPhoto(null);
      } else {
        console.error("Failed to submit review:", response.data.message);
        toast.error(response.data.message || "Failed to submit review");
        if (response.data.message === "Sản phẩm không tồn tại") {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi thêm đánh giá");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-black bg-opacity-30 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-5 rounded relative m-5">
          <AiOutlineClose
            className="absolute top-3 right-5"
            onClick={onCancel}
          />
          <h2 className="text-center text-lg font-bold tracking-tight text-gray-900">
            Đánh giá sản phẩm
          </h2>
          <form
            method="POST"
            className="mx-auto max-w-xl sm:mt-5"
            encType="multipart/form-data"
          >
            <div className="flex flex-col items-center justify-center grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="w-full p-1">
                <p className="text-sm my-2 font-titleFont font-semibold px-2">
                  Đánh giá sao
                </p>
                <Menu as="div" className="w-full text-left">
                  {({ open }) => (
                    <>
                      <div>
                        <span className="rounded-md shadow-sm">
                          <Menu.Button className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover-bg-gray-50">
                            <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                              {selectedStars > 0
                                ? `${selectedStars} sao`
                                : "Chọn đánh giá"}
                            </span>
                            <AiOutlineDown
                              className="-mr-1 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </span>
                      </div>

                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {status.map((t) => (
                          <Menu.Item key={t}>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? "bg-gray-100" : "bg-white"
                                } block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left`}
                                onClick={() => {
                                  handleStarsChange(t);
                                }}
                              >
                                {t} sao
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </>
                  )}
                </Menu>
              </div>
            </div>
            <div className="w-full">
              <label
                htmlFor="comment"
                className="text-sm my-2 font-titleFont font-semibold px-2"
              >
                Nhận xét
              </label>
              <textarea
                id="comment"
                name="comment"
                value={comment}
                onChange={handleCommentChange}
                placeholder="Nhận xét của bạn..."
                rows={4}
                className="w-full py-1 border-b-2 rounded-md px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="photo"
                className="text-sm my-2 font-titleFont font-semibold px-2"
              >
                Thêm ảnh đánh giá
              </label>
              <input
                type="file"
                id="photo"
                name="reviewPhoto"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                accept="image/*"
              />
            </div>
            <div className="mt-10 flex justify-center">
              <button
                className="w-full md:w-44 bg-primeColor text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:bg-black hover:text-white duration-200"
                onClick={(e) => submitReview(e)}
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
