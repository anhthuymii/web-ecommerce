import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-black bg-opacity-30 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-5 rounded relative m-5">
          <AiOutlineClose
            className="absolute top-3 right-5"
            onClick={onCancel}
          />
          <p className="text-base mt-3 font-semibold leading-6 text-gray-900">
            {message}
          </p>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              onClick={onConfirm}
            >
              Xóa
            </button>
            <button
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={onCancel}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
