import React, { useState } from "react";
import LoadModal from "./LoadModal";

const LoadSamples = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="m-4">
      <button
        className="border border-white rounded text-white hover:text-custom-green hover:border-custom-green p-2"
        onClick={() => setShowModal(true)}
      >
        Load Samples
      </button>
      <LoadModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default React.memo(LoadSamples);
