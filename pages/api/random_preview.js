import { getAccessToken } from "../../lib/spotify";
import axios from "axios";
import randomElement from "../../utils/randomElement";
import { fetchPreviewUrls } from "@/store/spotifySlice";
// import { keyMapping } from "../../store/spotifySlice";

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

const handler = async (req, res) => {
  if (req.method === "GET") {
    const selectedKey = req.query.selectedKey;
    const selectedPitchClass = keyMapping[selectedKey];

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        res.status(500).json({ error: "Error fetching access token" });
        return;
      }

      const genresResponse = await axios.get(
        "https://api.spotify.com/v1/browse/categories",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const genres = genresResponse.data.categories.items;
      const genre = randomElement(genres);

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

      let track;
      let previewUrl = null;

      while (!previewUrl && tracks.length > 0) {
        track = randomElement(tracks);
        previewUrl = track.preview_url;
        if (!previewUrl) {
          tracks.splice(tracks.indexOf(track), 1); // Remove the track without preview_url from the list
        }
      }

      if (previewUrl) {
        res
          .status(200)
          .json({
            previewUrl,
            trackInfo: { artist: track.artists[0].name, name: track.name },
          });
      } else {
        res.status(500).json({ error: "No tracks with preview URLs found" });
      }
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Error fetching random preview URL" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
