import React, { useState } from "react";
import { useSelector } from "react-redux";
import LoadModal from "./LoadModal";

const LoadSamples = ({ items, updateItems }) => {
  const [showModal, setShowModal] = useState(false);

  // const loadSavedSampleState = (key) => {
  //   const savedState = localStorage.getItem(key);
  //   if (savedState) {
  //     const parsedState = JSON.parse(savedState);
  //   } else {
  //     console.error("No saved state found with key:", key);
  //   }
  // };

  return (
    <div className="m-4">
      <button
        className="border border-white rounded text-white hover:text-custom-green hover:border-custom-green p-2"
        onClick={() => setShowModal(true)}
      >
        Load Samples
      </button>
      <LoadModal
        showModal={showModal}
        setShowModal={setShowModal}
        items={items}
        updateItems={updateItems}
      />
    </div>
  );
};

export default LoadSamples;
