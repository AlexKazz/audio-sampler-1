import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateState,
  deleteItem,
  updateItems,
  loadedSampleSet,
} from "../store/spotifySlice";
import { getAllLocalStorageItems } from "../utils/localStorageUtils";

const LoadModal = ({ showModal, setShowModal }) => {
  const sampleState = useSelector((state) => state.spotify);
  const items = useSelector((state) => state.spotify.items);
  const dispatch = useDispatch();
  // const items = getAllLocalStorageItems();
  useEffect(() => {
    const items = getAllLocalStorageItems();
    dispatch(updateItems(items));
  }, [dispatch]);

  const handleClick = (value) => {
    dispatch(updateState(value));
    dispatch(loadedSampleSet(value));
    setShowModal(false);
  };

  const handleDelete = (key) => {
    // localStorage.removeItem(key);
    dispatch(deleteItem(key));
  };

  const sortItemsByOldest = (items) => {
    return [...items].sort((a, b) => b.timestamp - a.timestamp);
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/3 h-1/2 flex flex-col">
        <h2 className="text-xl mb-4 text-center">Select sample set to load:</h2>
        <div className="h-2/3 overflow-auto">
          <ul className="">
            {sortItemsByOldest(items).map((item) => (
              <div
                key={item.key}
                className="group flex justify-between hover:bg-slate-200 p-2 border-b-2"
              >
                <li onClick={() => handleClick(item.value)} className="">
                  {item.key}
                </li>
                <div className="hidden group-hover:block">
                  {" "}
                  <button
                    className="rounded text-black hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(item.value);
                    }}
                  >
                    Load
                  </button>
                  <button
                    className=" text-black rounded ml-4 hover:underline"
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
            className="border border-black text-black px-4 py-2 rounded hover:bg-slate-200"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadModal;
