import { Component, useEffect, useState } from "react";
import './App.css';
import axios from 'axios';

function App() {
  const CLIENT_ID = "b41efec06d664ce38d7b3a98e33050ea"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  const [tracks, setTracks] = useState([])
   
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if(!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]


      window.location.hash = ""
      window.localStorage.setItem("token", token)
      
    }

    setToken(token)

  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "artist"
      }
    })

    setArtists(data.artists.items)
  }

  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id}>
        {artist.name}
        {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No image</div>}
      </div>
    ))
  }

  const searchTracks = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: 'track'
      }
    })
    setTracks(data.tracks.items)
  }

  const renderTracks = () => {
    return tracks.map(track => (
      <div key={track.id}>
        {track.images.length ? <img width={"100%"} src={track.images[0].url} alt=""/> : <div>No Image</div>}
      </div>
    ))
  }
  

  return (
    <div className="flex flex-col items-center bg-black w-full justify-center bg-[#18D860] text-white p-5 rounded-full">
        {!token ?
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
        : <button onClick={logout}>Logout</button>}

        {token ?
          <form onSubmit={searchArtists}>
            <input placeholder="Search Artist" type="text" onChange={e => setSearchKey(e.target.value)}/>
            <button type={"submit"} placeholder="Search Artist" >Search</button>
          </form>

          :<h2></h2>
          
          }

          {renderArtists()}

     
    </div>
  );
}



export default App;
