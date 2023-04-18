import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

const Home = () => {
  const [activeKeys, setActiveKeys] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});
  const [trackInfo, setTrackInfo] = useState({});
  const [selectedKey, setSelectedKey] = useState("C");

  const audioRefs = useRef({});

  const keyMapping = {
    C: 0,
    "C#": 1,
    D: 2,
    "D#": 3,
    E: 4,
    F: 5,
    "F#": 6,
    G: 7,
    "G#": 8,
    A: 9,
    "A#": 10,
    B: 11,
  };

  const fetchPreviewUrls = async () => {
    const response = await axios.get("/api/spotify");
    const accessToken = response.data.accessToken;
    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    ///
    const selectedPitchClass = keyMapping[selectedKey];
    ///

    try {
      const genresResponse = await axios.get(
        "https://api.spotify.com/v1/browse/categories",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const genres = genresResponse.data.categories.items;

      const randomGenre = (genres) => {
        return genres[Math.floor(Math.random() * genres.length)];
      };

      const urls = {};

      for (let i = 0; i < 10; i++) {
        const genre = randomGenre(genres);
        const playlistResponse = await axios.get(
          `https://api.spotify.com/v1/browse/categories/${genre.id}/playlists?limit=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const playlist = playlistResponse.data.playlists.items[0];
        const tracksResponse = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=100`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const tracks = tracksResponse.data.items.map((item) => item.track);
        const trackIds = tracks.map((track) => track.id);
        const randomTrack = (tracks) => {
          return tracks[Math.floor(Math.random() * tracks.length)];
        };

        const track = randomTrack(tracks);
        urls[i] = track.preview_url;
        trackInfo[i] = { artist: track.artists[0].name, name: track.name };

        ///************* */
        const audioFeaturesResponse = await axios.get(
          `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        ///************* */

        const audioFeatures = audioFeaturesResponse.data.audio_features;
        const tracksInSelectedKey = tracks.filter(
          (track, index) => audioFeatures[index].key === selectedPitchClass
        );
      }

      setPreviewUrls(urls);
    } catch (error) {
      console.error("Error fetching random songs:", error);
    }
  };

  useEffect(() => {
    // fetchPreviewUrls();

    const handleKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        setActiveKeys((prevState) => ({ ...prevState, [e.key]: true }));

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
      if (e.key >= "0" && e.key <= "9") {
        setActiveKeys((prevState) => ({ ...prevState, [e.key]: false }));
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
  }, [trackInfo]);

  // useEffect(() => {
  //   fetchPreviewUrls();
  // }, [selectedKey]);

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
          onChange={(e) => setSelectedKey(e.target.value)}
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
          onClick={() => fetchPreviewUrls()}
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
