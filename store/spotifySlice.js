import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import randomElement from "../utils/randomElement";

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

const getRandomTrackWithPreview = (tracks, maxAttempts = 10) => {
  let attempts = 0;
  let track = null;

  while (attempts < maxAttempts) {
    const randomIndex = Math.floor(Math.random() * tracks.length);
    track = tracks[randomIndex];
    if (track.preview_url) {
      break;
    }
    attempts++;
  }

  return track;
};

export const updateTrackInfo = createAction("spotify/updateTrackInfo");

export const fetchPreviewUrls = createAsyncThunk(
  "spotify/fetchPreviewUrls",
  async (selectedKey) => {
    const response = await axios.get("/api/spotify");
    const accessToken = response.data.accessToken;
    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    const selectedPitchClass = keyMapping[selectedKey];

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

      const urls = {};
      const trackInfo = {};

      for (let i = 0; i < 10; i++) {
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
        // console.log(tracksResponse.data);
        const tracks = tracksResponse.data.items.map((item) => {
          // console.log(item.track.album.images[0].url);
          return item.track;
        });

        const track = getRandomTrackWithPreview(tracks);
        if (track) {
          urls[i] = track.preview_url;
          trackInfo[i] = {
            artist: track.artists[0].name,
            name: track.name,
            albumImageUrl: track.album.images[0].url,
          };
        } else {
          console.error(
            "No track with preview_url found after multiple attempts"
          );
        }
      }

      return { previewUrls: urls, trackInfo: trackInfo, isLoading: false };
    } catch (error) {
      console.error("Error fetching random songs:", error);
    }
  }
);

const initialState = {
  activeKeys: {},
  previewUrls: {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
  },
  trackInfo: {
    0: { artist: "", name: "", albumImageUrl: "" },
    1: { artist: "", name: "", albumImageUrl: "" },
    2: { artist: "", name: "", albumImageUrl: "" },
    3: { artist: "", name: "", albumImageUrl: "" },
    4: { artist: "", name: "", albumImageUrl: "" },
    5: { artist: "", name: "", albumImageUrl: "" },
    6: { artist: "", name: "", albumImageUrl: "" },
    7: { artist: "", name: "", albumImageUrl: "" },
    8: { artist: "", name: "", albumImageUrl: "" },
    9: { artist: "", name: "", albumImageUrl: "" },
  },
  selectedKey: "C",
  items: [],
  sliderValues: {},
};

export const fetchRandomPreviewUrl = createAsyncThunk(
  "spotify/fetchRandomPreviewUrl",
  async (key) => {
    const response = await axios.get(`/api/random_preview?selectedKey=${key}`);
    const previewUrl = response.data.previewUrl;
    const trackInfo = response.data.trackInfo;
    return { key, previewUrl, trackInfo };
  }
);

export const updatePreviewUrl = createAction("spotify/updatePreviewUrl");

const spotifySlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    setActiveKey: (state, action) => {
      state.activeKeys[action.payload] = true;
    },
    clearActiveKey: (state, action) => {
      state.activeKeys[action.payload] = false;
    },
    setSelectedKey: (state, action) => {
      state.selectedKey = action.payload;
    },
    updateState: (state, action) => {
      state.activeKeys = action.payload.activeKeys;
      state.previewUrls = action.payload.previewUrls;
      state.trackInfo = action.payload.trackInfo;
      state.selectedKey = action.payload.selectedKey;
      state.sliderValues = action.payload.sliderValues;
    },
    updateItems: (state, action) => {
      state.items = action.payload;
    },
    deleteItem: (state, action) => {
      const keyToDelete = action.payload;
      // Remove the item from local storage
      localStorage.removeItem(keyToDelete);
      // Remove the item from the Redux state
      state.items = state.items.filter((item) => item.key !== keyToDelete);
    },
    updateSliderValues: (state, action) => {
      const { key, value } = action.payload;
      state.sliderValues[key] = value;
    },
    loadedSampleSet: (state, action) => {
      state.loadedSampleSet = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPreviewUrls.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPreviewUrls.fulfilled, (state, action) => {
        state.previewUrls = action.payload.previewUrls;
        state.trackInfo = action.payload.trackInfo;
        state.isLoading = action.payload.isLoading;
      })
      .addCase(updatePreviewUrl, (state, action) => {
        const { key, newPreviewUrl } = action.payload;
        state.previewUrls[key] = newPreviewUrl;
      })
      .addCase(updateTrackInfo, (state, action) => {
        const { key, trackInfo } = action.payload; // Get the key from the action payload
        state.trackInfo[key] = trackInfo; // Update only the track information for the specific key
      });
  },
});

export const {
  setActiveKey,
  clearActiveKey,
  setSelectedKey,
  updateState,
  updateItems,
  deleteItem,
  updateSliderValues,
  loadedSampleSet,
} = spotifySlice.actions;

export default spotifySlice.reducer;
