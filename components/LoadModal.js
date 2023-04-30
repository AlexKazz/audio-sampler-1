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

  const handleDelete = (key) => {
    localStorage.removeItem(key);
    setItems(items.filter((item) => item.key !== key));
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-1/2 flex flex-col">
        <h2 className="text-xl mb-4 text-center">Select sample set to load:</h2>
        <div className="h-2/3 overflow-auto">
          <ul className="space-y-2">
            {items.map((item) => (
              <div
                key={item.key}
                className="group flex justify-between hover:bg-slate-200 p-2 border-b-0"
              >
                <li onClick={() => handleClick(item.value)} className="">
                  {item.key}
                </li>
                <div className="hidden group-hover:block">
                  {" "}
                  <button
                    className="border border-black text-black hover:bg-slate-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(item.value);
                    }}
                  >
                    Load
                  </button>
                  <button
                    className="border border-black text-black rounded ml-1 hover:bg-slate-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.key);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>
        <div className="flex justify-evenly mt-4">
          <button
            className="border border-black text-black px-4 py-2 rounded hover:bg-slate-400"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="border border-black text-black px-4 py-2 rounded hover:bg-slate-400"
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
