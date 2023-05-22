import React, { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      {showSidebar ? (
        <button
          className={`flex text-3xl  bg-custom-black text-white
           hover:text-custom-green items-center cursor-pointer fixed right-10 top-6 z-50`}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          x
        </button>
      ) : (
        <svg
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed z-30 flex items-center cursor-pointer right-5 top-5"
          fill="#2563EB"
          viewBox="0 0 100 80"
          width="40"
          height="40"
        >
          <AiOutlineQuestionCircle className="text-7xl hover:text-custom-green text-white" />
        </svg>
      )}

      <div
        className={`overflow-y-auto top-0 right-0 md:w-5/12 shadow shadow-white bg-custom-black text-white
          p-10 pl-20 fixed h-full z-40 ease-in-out duration-300
        ${showSidebar ? "translate-x-0 " : "translate-x-full"}`}
      >
        <h3 className="mt-10 text-lg font-fell">
          <p className="mb-5">
            • Spotify Audio Sampler is meant to be a fun way to explore{" "}
            <a
              href="https://youtu.be/grCMo2sykBs?t=31"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-custom-green"
            >
              sampling music,
            </a>{" "}
            in a similar way to how hip-hop producers have used the{" "}
            <a
              href="https://www.vox.com/culture/2018/4/16/16615352/akai-mpc-music-history-impact"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-custom-green"
            >
              Akai MPC.
            </a>
          </p>

          <p className="mb-5">
            • This application is currently in development, so thank you for
            your patience as I continue to add more features and improve the
            user experience.
          </p>
          <p className="mb-5">
            ➡️{" "}
            <a
              href="https://github.com/AlexKazz/spotify-audio-sampler"
              target="_blank"
              rel="noreferrer"
              className="hover:text-custom-green underline"
            >
              Learn more about Spotify Audio Sampler on GitHub
            </a>
          </p>
        </h3>
      </div>
    </>
  );
};

export default React.memo(Sidebar);
