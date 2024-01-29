import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { FormEvent } from 'react'
import './App.css'


function AlbumPicker() {
    const [songs, setSongs] = useState<string[]>([]);
    const [filteredAlbums, setFilteredSongs] = useState<string[]>([]);
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            artist: { value: string };
        };
        const artist = encodeURIComponent(target.artist.value);
        const url = `https://musicbrainz.org/ws/2/release?fmt=json&query=artist:${artist}`;
        const response = await fetch(url);
        const mbResult = (await response.json()) as {
            releases: { title: string, date: string }[];
        };
        const { releases } = mbResult;
        const songList = releases.map(({ title, date }) => `${title} (${date})`)
        setSongs(songList);
        setFilteredSongs(songList);
    }
    function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
        const album = e.target.value.toLowerCase();
        setFilteredSongs(songs.filter(a => a.toLowerCase().includes(album)));
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Artist name:
                <input name="artist" />
            </label>
            <button type="submit">Search</button>
            <br/>
            <label>
                Album name:
                <input name="album" onChange={handleFilter}/>
            </label>
            <p>Albums:</p>
            <ol>
                {filteredAlbums.map((album) => (
                    <li>{album}</li>
                ))}
            </ol>
        </form>
    );
}
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
        <AlbumPicker />
    </>
  )
}

export default App
