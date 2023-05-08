import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateItems } from "../store/spotifySlice";
import { getAllLocalStorageItems } from "../utils/localStorageUtils";

const SaveModal = ({ showModal, setShowModal }) => {
  const [inputValue, setInputValue] = useState("");
  const sampleState = useSelector((state) => state.spotify);
  const dispatch = useDispatch();

  if (!showModal) {
    return null;
  }

  const handleSave = () => {
    const newState = { ...sampleState, timestamp: Date.now() };

    localStorage.setItem(inputValue, JSON.stringify(newState));
    setInputValue("");

    const updatedItems = getAllLocalStorageItems();
    dispatch(updateItems(updatedItems));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl mb-4 text-center">Name your sample set:</h2>
        <input
          type="text"
          className="border border-gray-300 p-2 w-full mb-4 text-black"
          placeholder="Enter sample name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex justify-evenly">
          <button
            className="bg-custom-green text-white px-4 py-2 rounded mt-4 mr- hover:bg-green-400"
            onClick={() => {
              handleSave();
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

export default SaveModal;
