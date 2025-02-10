import React, { useEffect, useRef, useState } from "react";
import { FaRegFileImage } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";

const ImageSelector = ({ image, setImage , handleDeleteImg}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImgChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = ()=>{
    setImage(null);
    handleDeleteImg();
  }
  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  useEffect(() => {
    if (typeof image === "string") {
      setPreviewUrl(image);
    } else if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  return (
    <div>
      {/* Button to select image */}
      <label
        htmlFor="fileInput"
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        onClick={onChooseFile}
      >
        Choose Image
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImgChange}
        className="hidden"
      />

      {image ? (
        <div className="w-full relative mt-4">
          <img
            src={previewUrl}
            alt="selected"
            className="w-full h-[300px] object-cover rounded-lg"
          />

          {/* Delete Button */}
          <button
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
            onClick={() => {
                setImage(null)
                handleDeleteImg()
            }}
          >
            <MdDeleteOutline className="text-red-500 text-lg" />
          </button>
        </div>
      ) : (
        <button
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50 mt-4"
          onClick={onChooseFile}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
            <FaRegFileImage className="text-xl text-cyan-500" />
          </div>
          <p className="text-sm text-slate-500">Browse your image files to upload</p>
        </button>
      )}
    </div>
  );
};

export default ImageSelector;
