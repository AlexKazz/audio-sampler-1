// components/TrackInfo.js
import React from "react";
import styles from "../styles/Home.module.css";

const TrackInfo = ({ artist, name }) => {
  return (
    <div className={styles.trackInfo}>
      <div>{artist}</div>
      <div>{name}</div>
    </div>
  );
};

export default TrackInfo;
