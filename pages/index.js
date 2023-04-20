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
import Head from "next/head";

const Home = () => {
  // const [isLoading, setIsLoading] = useState(false);
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

        // Pause all other audio elements
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
    console.log("action result", actionResult);
    const {
      key: fetchedKey,
      previewUrl: newPreviewUrl,
      trackInfo,
    } = actionResult.payload;

    dispatch(updatePreviewUrl({ key: fetchedKey, newPreviewUrl }));
    dispatch(updateTrackInfo({ key: fetchedKey, trackInfo }));
  };

  return (
    <div className={styles.container}>
      <div>
        <title>Spotify Music Sampler</title>
        <meta
          name="description"
          content="Play random 1-second music snippets"
        />
        <link rel="icon" href="/favicon.ico" />
      </div>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className={styles.main}>
        <p className="mb-10 text-white text-2xl">Spotify Music Sampler</p>
        <p className="mb-10 text-white text-center">
          Press the corresponding keys on your keyboard to play a short audio
          clip from Spotify.
        </p>
        <div>
          <span className="text-white mr-2">Musical Key: </span>
          <select
            className={styles.keySelect}
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
          className={styles.newAudioButton}
          onClick={() => dispatch(fetchPreviewUrls(selectedKey))}
        >
          Get New Audio
        </button>
        {isLoading && <Loading />}
        <div className={styles.grid}>
          {previewUrls &&
            Object.keys(previewUrls).map((key) => (
              <div key={key} className={styles.buttonContainer}>
                <button
                  className={styles.changeButton}
                  onClick={() => changeAudio(key)}
                >
                  Change
                </button>
                <button
                  className={`${styles.keyButton} ${
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
                <div className={styles.trackInfo}>
                  <div>{trackInfo[key]?.artist}</div>
                  <div>{trackInfo[key]?.name}</div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
