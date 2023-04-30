import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateState } from "../store/spotifySlice";

const LoadModal = ({ showModal, setShowModal }) => {
  const [items, setItems] = useState([]);
  const sampleState = useSelector((state) => state.spotify);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllLocalStorageItems = () => {
      const items = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = JSON.parse(localStorage.getItem(key));
        items.push({ key, value });
      }

      return items;
    };

    setItems(getAllLocalStorageItems());
  }, []);

  const handleClick = (value) => {
    dispatch(updateState(value));
    setShowModal(false);
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl mb-4 text-center">Select sample set to load:</h2>
        <ul>
          {items.map((item) => (
            <li
              key={item.key}
              onClick={() => handleClick(item.value)}
              className="hover:bg-custom-green hover:text-white"
            >
              {item.key}
            </li>
          ))}
        </ul>
        <div className="flex justify-evenly">
          <button
            className="border border-black text-black px-4 py-2 rounded mt-4 hover:bg-slate-400"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="border border-black text-black px-4 py-2 rounded mt-4 hover:bg-slate-400"
            onClick={() => console.log(items)}
          >
            Log Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadModal;
