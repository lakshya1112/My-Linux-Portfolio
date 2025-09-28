// src/components/SpotifyWidget.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { FaSpotify } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = "https://my-linux-portfolio.vercel.app/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SCOPES = "user-read-currently-playing";

// Helper function to generate a random string for the code verifier
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Helper function to create the code challenge
const generateCodeChallenge = async (codeVerifier) => {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const SpotifyWidget = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("spotify_access_token"));
  const [nowPlaying, setNowPlaying] = useState(null);
  const [error, setError] = useState(null);
  
  // This ref will prevent the double-fetch in StrictMode
  const hasFetchedToken = useRef(false);

  const handleLogin = async () => {
    setError(null);
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem("spotify_code_verifier", codeVerifier);
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });
    window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
  };

  const handleLogout = () => {
    setAccessToken(null);
    setNowPlaying(null);
    localStorage.removeItem("spotify_access_token");
  };

  const getAccessToken = useCallback(async (code) => {
    const codeVerifier = localStorage.getItem("spotify_code_verifier");
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    });

    try {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error_description || 'Something went wrong with Spotify.');
      }
      localStorage.setItem("spotify_access_token", data.access_token);
      setAccessToken(data.access_token);
      window.history.pushState({}, null, "/");
    } catch (err) {
      console.error("Error fetching access token", err);
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !hasFetchedToken.current) {
      hasFetchedToken.current = true;
      getAccessToken(code);
    }
  }, [getAccessToken]);

  useEffect(() => {
    const getNowPlaying = async () => {
      if (!accessToken) return;
      try {
        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.status === 401) { // Token expired
            handleLogout();
            return;
        }
        if (response.status === 204 || response.status > 400) {
          setNowPlaying(null);
          return;
        }
        const song = await response.json();
        setNowPlaying(song);
      } catch (err) {
        console.error("Error fetching now playing:", err);
      }
    };
    if (accessToken) {
      getNowPlaying();
      const interval = setInterval(getNowPlaying, 15000);
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  if (!CLIENT_ID) {
    return (
      <div className="absolute bottom-4 left-4 text-white p-3 rounded-2xl bg-red-800/80 backdrop-blur-md z-10 text-xs">
        Spotify Client ID is missing. Please check your .env.local file.
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 text-white p-3 rounded-2xl bg-black/40 backdrop-blur-lg border border-white/10 w-64 z-10 shadow-lg">
      {!accessToken ? (
        <div>
          <button onClick={handleLogin} className="flex items-center gap-2 justify-center font-semibold text-sm w-full">
            <FaSpotify size={20} /> Login to Spotify
          </button>
          {error && <p className="text-xs text-red-400 mt-2 text-center">{error}</p>}
        </div>
      ) : (
        <div>
          {nowPlaying && nowPlaying.item ? (
            <div className="flex items-center gap-3">
              <img src={nowPlaying.item.album.images[0].url} alt={nowPlaying.item.album.name} className="w-14 h-14 rounded-md flex-shrink-0" />
              <div className="flex-grow min-w-0">
                <a href={nowPlaying.item.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="font-bold text-sm hover:underline truncate block">{nowPlaying.item.name}</a>
                <p className="text-xs opacity-80 truncate">{nowPlaying.item.artists.map(artist => artist.name).join(', ')}</p>
              </div>
              <button onClick={handleLogout} title="Logout" className="ml-auto text-white/60 hover:text-white transition-colors flex-shrink-0">
                <IoLogOutOutline size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm opacity-80">
                    <FaSpotify size={20} />
                    <span>Not currently playing</span>
                </div>
                <button onClick={handleLogout} title="Logout" className="text-white/60 hover:text-white transition-colors">
                    <IoLogOutOutline size={20} />
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpotifyWidget;
