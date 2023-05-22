import React, { useState } from "react";
import SaveModal from "./SaveModal";

const SaveSamples = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="m-4">
      <button
        className="border border-white rounded text-white hover:text-custom-green hover:border-custom-green p-2"
        onClick={() => setShowModal(true)}
      >
        Save Samples
      </button>
      <SaveModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default React.memo(SaveSamples);
