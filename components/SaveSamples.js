import React, { useState } from "react";
import { useSelector } from "react-redux";
import SaveModal from "./SaveModal";

const SaveSamples = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="m-4">
      <button
        className="border border-white rounded-full text-white hover:text-custom-green p-2"
        onClick={() => setShowModal(true)}
      >
        Save Samples
      </button>
      <SaveModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default SaveSamples;
