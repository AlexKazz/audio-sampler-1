// components/KeyButton.js
import React from "react";
import styles from "../styles/Home.module.css";

const KeyButton = ({ keyNumber, active, audioRef, previewUrl }) => {
  return (
    <button className={`${styles.keyButton} ${active ? styles.active : ""}`}>
      {keyNumber}
      <audio ref={audioRef} src={previewUrl} />
    </button>
  );
};

export default KeyButton;
