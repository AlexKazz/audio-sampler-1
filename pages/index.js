import { useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPreviewUrls,
  setActiveKey,
  clearActiveKey,
  setSelectedKey,
} from "../store/spotifySlice";

const Home = () => {
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

  return (
    <div className={styles.container}>
      <div>
        <title>Random Music Player</title>
        <meta
          name="description"
          content="Play random 1-second music snippets"
        />
        <link rel="icon" href="/favicon.ico" />
      </div>

      <main className={styles.main}>
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

        <button
          className={styles.newAudioButton}
          onClick={() => dispatch(fetchPreviewUrls(selectedKey))}
        >
          Get new audio
        </button>

        <div className={styles.grid}>
          {Object.keys(previewUrls).map((key) => (
            <div key={key} className={styles.buttonContainer}>
              <button
                className={`${styles.keyButton} ${
                  activeKeys[key] ? styles.active : ""
                }`}
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
