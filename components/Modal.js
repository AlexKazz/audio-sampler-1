import React, { useState } from "react";
import { useSelector } from "react-redux";

const Modal = ({ showModal, setShowModal }) => {
  const [inputValue, setInputValue] = useState("");
  const sampleState = useSelector((state) => state.spotify);

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl mb-4 text-center">
          Please name your sample set:
        </h2>
        <input
          type="text"
          className="border border-gray-300 p-2 w-full mb-4"
          placeholder="Enter sample name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex justify-evenly">
          <button
            className="bg-custom-green text-white px-4 py-2 rounded mt-4 mr- hover:bg-green-400"
            onClick={() => {
              localStorage.setItem(inputValue, JSON.stringify(sampleState));
              setInputValue("");
              console.log(inputValue);
              console.log(sampleState);
              setShowModal(false);
            }}
          >
            Save
          </button>
          <button
            className="border border-black text-black px-4 py-2 rounded mt-4 hover:bg-slate-400"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
