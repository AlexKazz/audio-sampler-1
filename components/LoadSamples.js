import React from "react";

const LoadSamples = () => {
  const loadSavedSampleState = (key) => {
    const savedState = localStorage.getItem(key);
    console.log("UNPARSED savedState", savedState);
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
        onClick={() => console.log("keys", loadSavedSampleState("penis"))}
      >
        Load Samples
      </button>
    </div>
  );
};

export default LoadSamples;
