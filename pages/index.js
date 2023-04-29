import { useState, useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from "react-redux";
import Loading from "../components/Loading";
import {
  fetchPreviewUrls,
  setActiveKey,
  clearActiveKey,
  setSelectedKey,
  fetchRandomPreviewUrl,
  updatePreviewUrl,
  updateTrackInfo,
} from "../store/spotifySlice";
import Sidebar from "@/components/Sidebar";
import SaveSamples from "@/components/SaveSamples";

const Home = () => {
  const isLoading = useSelector((state) => state.spotify.isLoading);
  const dispatch = useDispatch();
  const activeKeys = useSelector((state) => state.spotify.activeKeys);
  const previewUrls = useSelector((state) => state.spotify.previewUrls);
  const trackInfo = useSelector((state) => state.spotify.trackInfo);
  const selectedKey = useSelector((state) => state.spotify.selectedKey);
  const audioRefs = useRef({});

  const validKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
    } else {
      dispatch(fetchPreviewUrls(selectedKey));
    }

    const handleKeyDown = (e) => {
      if (validKeys.includes(e.key)) {
        dispatch(setActiveKey(e.key));

        for (let i = 0; i < 10; i++) {
          if (e.key !== i.toString() && audioRefs.current[i]) {
            audioRefs.current[i].pause();
            audioRefs.current[i].currentTime = 0;
          }
        }

        if (audioRefs.current[e.key]) {
          audioRefs.current[e.key].currentTime = 0;
          audioRefs.current[e.key].play();
        }
      }
    };

    const handleKeyUp = (e) => {
      if (validKeys.includes(e.key)) {
        dispatch(clearActiveKey(e.key));
        if (audioRefs.current[e.key]) {
          setTimeout(() => {
            audioRefs.current[e.key].pause();
          }, 2000);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedKey]);

  const handleClick = (key) => {
    if (audioRefs.current[key]) {
      audioRefs.current[key].currentTime = 0;
      audioRefs.current[key].play();
      setTimeout(() => {
        audioRefs.current[key].pause();
      }, 1000);
    }
  };

  const changeAudio = async (key) => {
    const actionResult = await dispatch(fetchRandomPreviewUrl(key));

    const {
      key: fetchedKey,
      previewUrl: newPreviewUrl,
      trackInfo,
    } = actionResult.payload;

    dispatch(updatePreviewUrl({ key: fetchedKey, newPreviewUrl }));
    dispatch(updateTrackInfo({ key: fetchedKey, trackInfo }));
  };

  return (
    <div className="bg-custom-black min-h-screen max-w-full min-w-full p-10">
      <div>
        <title>Spotify Audio Sampler</title>
        <meta
          name="description"
          content="Play random 1-second music snippets"
        />
        <link rel="icon" href="/favicon.ico" />
      </div>
      <main className="flex flex-col justify-center items-center font-fell">
        <p className="text-white text-2xl mb-10">Spotify Audio Sampler</p>

        <p className="mb-10 text-white text-center italic">
          Press the corresponding keys on your keyboard to play a short audio
          clip from Spotify.
        </p>
        <div>
          <span className="text-white mr-2">Musical Key: </span>
          <select
            value={selectedKey}
            onChange={(e) => dispatch(setSelectedKey(e.target.value))}
          >
            <option value="C">C</option>
            <option value="C#">C#</option>
            <option value="D">D</option>
            <option value="D#">D#</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="F#">F#</option>
            <option value="G">G</option>
            <option value="G#">G#</option>
            <option value="A">A</option>
            <option value="A#">A#</option>
            <option value="B">B</option>
          </select>
        </div>
        <SaveSamples />
        <button
          className="bg-custom-green text-white text-sm font-bold p-2 rounded m-4 hover:bg-green-300"
          onClick={() => dispatch(fetchPreviewUrls(selectedKey))}
        >
          Get New Audio
        </button>
        {isLoading && <Loading />}
        <div className="grid lg:grid-cols-5 grid-cols-3">
          {previewUrls &&
            Object.keys(previewUrls).map((key) => (
              <div key={key} className="flex flex-col items-center mb-4 mx-2">
                <button
                  className="bg-custom-green text-white text-xs p-2 rounded-full m-2 hover:bg-green-300"
                  onClick={() => changeAudio(key)}
                >
                  Change
                </button>
                <button
                  className={`${
                    styles.keyButton
                  } flex items-center justify-center bg-neutral-700 text-white border-2 border-custom-green rounded-xl mb-2 w-12 h-12 text-2xl hover:bg-green-500 focus:bg-custom-green active:bg-custom-green ${
                    activeKeys[key] ? styles.active : ""
                  }`}
                  onClick={() => handleClick(key)}
                >
                  {key}
                  <audio
                    ref={(el) => (audioRefs.current[key] = el)}
                    src={previewUrls[key]}
                  />
                </button>
                <div className="flex flex-col justify-center text-white text-xs text-center max-h-fit w-36 mx-5 px-5 whitespace-break-spaces">
                  <div>{trackInfo[key]?.artist}</div>
                  <div>{trackInfo[key]?.name}</div>
                </div>
              </div>
            ))}
        </div>
        <Sidebar />
      </main>
    </div>
  );
};

export default Home;
