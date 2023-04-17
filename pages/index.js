import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

const Home = () => {
  const [activeKeys, setActiveKeys] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});
  const audioRefs = useRef({});

  useEffect(() => {
    const fetchPreviewUrls = async () => {
      const response = await axios.get("/api/spotify");
      const accessToken = response.data.accessToken;
      if (!accessToken) {
        console.error("No access token available");
        return;
      }

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
          const randomTrack = (tracks) => {
            return tracks[Math.floor(Math.random() * tracks.length)];
          };

          const track = randomTrack(tracks);
          urls[i] = track.preview_url;
        }

        setPreviewUrls(urls);
      } catch (error) {
        console.error("Error fetching random songs:", error);
      }
    };

    fetchPreviewUrls();

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
          }, 1000);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const renderButtons = () => {
    const buttons = [];

    for (let i = 0; i < 10; i++) {
      buttons.push(
        <button
          key={i}
          className={`${styles.button} ${activeKeys[i] ? styles.active : ""}`}
        >
          {i}
          <audio
            ref={(el) => (audioRefs.current[i] = el)}
            src={previewUrls[i]}
          />
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>{renderButtons()}</div>
    </div>
  );
};

export default Home;
