// _app.js
import { Provider } from "react-redux";
import { store } from "../store/store";
import "../styles/globals.css";
import { useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
