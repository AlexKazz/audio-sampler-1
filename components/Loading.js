import React from "react";
import styles from "../styles/Home.module.css";

const Loading = () => (
  <div className={styles.loading}>
    <div className={styles.spinner}></div>
  </div>
);

export default Loading;
