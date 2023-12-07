const SizesList = ({ selectedSizes, deleteSize }) => {
  return (
    selectedSizes.length > 0 && (
      <>
        <h3 className="right-heading">Size đã chọn: </h3>
        <div className="flex flex-wrap -mx-2">
          {selectedSizes.map((size) => (
            <div
              key={size}
              className="rounded bg-black text-white text-lg m-1 px-3"
              onClick={() => deleteSize(size)}
            >
              {size}
            </div>
          ))}
        </div>
      </>
    )
  );
};

export default SizesList;
