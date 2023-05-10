import { useState, useEffect, useRef, useCallback } from "react";
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
  updateSliderValues,
} from "../store/spotifySlice";
import Sidebar from "@/components/Sidebar";
import SaveSamples from "@/components/SaveSamples";
import LoadSamples from "@/components/LoadSamples";

const VALID_KEYS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const Home = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.spotify.isLoading);
  const activeKeys = useSelector((state) => state.spotify.activeKeys);
  const previewUrls = useSelector((state) => state.spotify.previewUrls);
  const trackInfo = useSelector((state) => state.spotify.trackInfo);
  const selectedKey = useSelector((state) => state.spotify.selectedKey);
  const sliderValuesState = useSelector((state) => state.spotify.sliderValues);
  const loadedSampleSet = useSelector((state) => state.spotify.loadedSampleSet);
  const items = useSelector((state) => state.spotify.items);

  const audioRefs = useRef({});
  const hasMounted = useRef(false);
  const [sampleOverlap, setSampleOverlap] = useState(false);
  const [sliderValues, setSliderValues] = useState({});

  useEffect(() => {
    if (loadedSampleSet) {
      setSliderValues(loadedSampleSet.sliderValues);
    }
  }, [loadedSampleSet]);

  useEffect(() => {}, [sliderValuesState]);

  useEffect(() => {
    Object.keys(previewUrls).forEach((key) => {
      if (audioRefs.current[key]) {
        audioRefs.current[key].src = previewUrls[key];
      }
    });
  }, [previewUrls]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
    } else {
      dispatch(fetchPreviewUrls(selectedKey));
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedKey]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [sampleOverlap]);

  const handleSliderChange = (key, value) => {
    setSliderValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (VALID_KEYS.includes(e.key)) {
        dispatch(setActiveKey(e.key));

        if (!sampleOverlap) {
          for (let i = 0; i < 10; i++) {
            if (e.key !== i.toString() && audioRefs.current[i]) {
              audioRefs.current[i].pause();
              audioRefs.current[i].currentTime = 0;
            }
          }
        }

        const startTime = sliderValues[e.key] || 0;
        const audio = audioRefs.current[e.key];
        if (audio) {
          audio.currentTime = startTime;
          audio.play().catch(() => {});

          dispatch(updateSliderValues({ key: e.key, value: startTime }));
        }
      }
    },
    [selectedKey, VALID_KEYS, dispatch]
  );

  const handleKeyUp = useCallback(
    (e) => {
      if (VALID_KEYS.includes(e.key)) {
        dispatch(clearActiveKey(e.key));
        if (audioRefs.current[e.key]) {
          setTimeout(() => {
            audioRefs.current[e.key].pause();
          }, 2000);
        }
      }
    },
    [selectedKey, sampleOverlap]
  );

  const handleClick = (key, startTime) => {
    playAudioFromStartTime(key);
    setTimeout(() => {
      if (audioRefs.current[key]) {
        audioRefs.current[key].pause();
      }
    }, 2000);
    dispatch(updateSliderValues({ key, value: startTime }));
  };

  const updateItems = () => {
    const newItems = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = JSON.parse(localStorage.getItem(key));
      newItems.push({ key, value });
    }

    setItems(newItems);
  };

  const playAudioFromStartTime = (key) => {
    const audio = audioRefs.current[key];
    const startTime = sliderValues[key] || 0;
    if (audio) {
      audio.currentTime = startTime;
      audio.play();
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
          <label className="flex items-center text-white cursor-pointer mb-4">
            <span className="mr-2 mb-2">Sample Overlap:</span>
            <span className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={sampleOverlap}
                onChange={() => setSampleOverlap(!sampleOverlap)}
              />
              <span
                className={`${
                  sampleOverlap ? "bg-green-400" : "bg-gray-200"
                } inline-block w-10 h-5 rounded-full transition-colors duration-200 ease-in`}
              ></span>
              <span
                className={`${
                  sampleOverlap ? "translate-x-6" : "translate-x-0"
                } absolute inset-y-0 left-0 w-4 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in`}
              ></span>
            </span>
          </label>

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
              <div
                key={key}
                className="flex flex-col items-center mb-4 mx-2 p-4"
              >
                <p className="text-sm text-white mb-2">
                  Start time: {sliderValues[key] || 0}
                </p>
                <input
                  type="range"
                  min="0"
                  max="28"
                  value={sliderValues[key] || 0}
                  onChange={(e) => handleSliderChange(key, e.target.value)}
                  className="w-24"
                />

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
                  onClick={() =>
                    handleClick(key, sliderValues[key] || 0)
                  }
                >
                  {key}
                  <audio
                    ref={(el) => (audioRefs.current[key] = el)}
                    src={previewUrls[key]}
                    preload="auto"
                  />
                </button>
                <div className="flex flex-col justify-center text-white text-xs text-center max-h-fit w-36 mx-5 px-5 whitespace-break-spaces">
                  <div>{trackInfo[key]?.artist}</div>
                  <div>{trackInfo[key]?.name}</div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex">
          <SaveSamples items={items} updateItems={updateItems} />
          <LoadSamples items={items} updateItems={updateItems} />
        </div>
        <Sidebar />
      </main>
    </div>
  );
};

export default Home;
