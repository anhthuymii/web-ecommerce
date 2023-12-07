import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ImageModal = ({ isOpen, imageUrl, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Enlarged Image Modal"
      className="flex justify-center items-center"
    >
      <img
        src={imageUrl}
        onRequestClose={onRequestClose}
        alt="Enlarged Review"
        className="max-w-auto border rounded-md mt-20 justify-center items-center max-h-full"
        style={{ width: "35%" }}
      />
    </Modal>
  );
};

export default ImageModal;
