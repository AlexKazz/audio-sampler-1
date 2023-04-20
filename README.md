<!-- [![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url] -->

<div>
<h1 align="center">Spotify Audio Sampler</h1>

<p align="center">
<a href="https://audio-sampler-1-klsj6tdjj-alexkazz.vercel.app/">Try It Out Here!</a>
</p>

<p align="center">
Turn your keyboard into a Spotify music sampler with the click of a button.
<br/>
(and drive your coworkers insane)
</p>
</div>
<br />

### Built With

- [![Javascript][javascript]][javascript-url]
- [![React.js][react.js]][react-url]
- [![Next.js][next.js]][next.js-url]
- [![Redux.js][redux.js]][redux.js-url]
- [![Node.js][node.js]][node.js-url]

# Table of Contents

- [How It Works](#how-it-works)
- [How To Use](#how-to-use)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Run Locally](#run-locally)

## How It Works

• Spotify Audio Sampler uses the <a href="https://developer.spotify.com/">Spotify API</a> to grab songs from Spotify's database.
<br/>
<br/>
• When you choose a key from the dropdown or press "Get New Audio", an API call is made from the server to the Spotify API.
<br/>
<br/>
• Information including artist, song title, and the song's preview url are returned.
<br/>
<br/>
• The track ID is then used to make a second Musixmatch API call to grab the <a href="https://developer.musixmatch.com/documentation/api-reference/track-snippet-get">lyric snippet</a>.
<br/>
<br/>
• Spotify Audio Sampler generates a random index when fetching data so different songs are returned for each API call.
<br/>
<br/>
• Due to limitations on available song information, the songs returned are not always in the key specified in the dropdown. This can be due to various reasons, such as certain songs not having a key associated with them, or that the metadata of those songs are incorrect. Fixing these types of errors is not feasible at this time.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

## How To Use

• Select a key from the dropdown, or simply press the "Get New Audio" button.
<br/>
• Get back 10 random song samples from the Spotify database, assigned to keys 0-9.
<br/>
• Changing the key or pressing "Get New Audio" loads 10 new samples.
<br/>
• Press "Change" over a specific key to change only that key's sample.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

## Roadmap

- [x] Build the UI
- [x] Develop the API logic
- [x] Jam out with Spotify audio samples
- [x] Replace React Hooks with Redux Toolkit
- [ ] Refactor parts of codebase to improve readability & efficiency
- [ ] Fix data fetching errors where song doesn't play / artist & song title are incorrect
- [ ] Add other data fetching parameters (genre, sample length, etc.)
- [ ] Add custom key assignments

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

## Run Locally

Getting started is easy! Just follow the steps below to get a local copy up and running.
<br/>
\_You will need to create a Spotify account for your own client ID and client secret.

### Prerequisites

- npm
  ```sh
  npm install
  ```
- Spotify account

### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:AlexKazz/audio-sampler-1.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create .env file in root folder containing the following:
   ```sh
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=<your Spotify client ID>
   SPOTIFY_CLIENT_SECRET=<your Spotify client secret>
   ```
4. Start the servers
   ```js
   npm run dev
   ```
5. Open the app in your browser
   ```sh
    http://localhost:3000/
   ```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/AlexKazz/audio-sampler-1
[contributors-url]: https://www.linkedin.com/in/alex-kazenoff/
[stars-shield]: https://img.shields.io/github/stars/audio-sampler-1
[stars-url]: https://github.com/AlexKazz/audio-sampler-1
[issues-shield]: https://img.shields.io/github/issues-raw/AlexKazz/audio-sampler-1
[issues-url]: https://github.com/AlexKazz/audio-sampler-1/issues
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[javascript]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[javascript-url]: https://www.javascript.com/
[node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[node.js-url]: https://nodejs.org/en/
[next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=next&logoColor=white
[next.js-url]: https://nextjs.com/
[redux.js]: https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white
[redux.js-url]: https://redux-toolkit.js.org/
