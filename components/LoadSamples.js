import React, { useState } from "react";
import { useSelector } from "react-redux";
import LoadModal from "./LoadModal";

const LoadSamples = () => {
  const [showModal, setShowModal] = useState(false);

  const loadSavedSampleState = (key) => {
    const savedState = localStorage.getItem(key);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Do something with the parsed state, like updating your state in the parent component
      console.log(parsedState);
    } else {
      console.error("No saved state found with key:", key);
    }
  };

  return (
    <div className="m-4">
      <button
        className="border border-white rounded-full text-white hover:text-custom-green p-2"
        onClick={() => setShowModal(true)}
      >
        Load Samples
      </button>
      <LoadModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default LoadSamples;
