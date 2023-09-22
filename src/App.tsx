import React, { useState, useEffect } from 'react';
import { Tile } from './interfaces/Tile'
import { SearchComponent } from './components/SearchComponent';
import { TileComponent } from './components/TileComponent';
import RefreshButton from './components/RefreshButton';

export const App: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [likedTiles, setLikedTiles] = useState<Tile[]>([]);
  const [titlesOfLiked, setLikedSet] = useState<Set<string>>(new Set());
  const titleSet = new Set(titlesOfLiked);

  const handleSearch = async (searchTerm: string) => {
    console.log("Handle search called with term:", searchTerm);  // Debugging line
    try {
        const response = await fetch(`http://localhost:80/search?q=${searchTerm}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data: any = await response.json();
        console.log("Response data:", data);  // Debugging line
        
        setTiles(data.result.map((tile: any) => ({
            name: tile.name || 'Unknown', 
            title: tile.title,
            summary: tile.summary,
            slug: tile.slug.current,
            status: tile.status,
            publishDate: new Date(tile.publishDate),
            owner: tile.owner,
            sharingImage1x1Url: tile.sharingImage1x1Url, 
            liked: tile.title in titleSet? true: false,
        })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  function updateSearchLikes() {
    titleSet.clear();
    for (const tile of likedTiles) {
      titleSet.add(tile.title);
    }
    console.log(`likedSet: ${[...titleSet]}`)
    setLikedSet(titleSet);
    let newArr = [...tiles];
    for (const tile of newArr) {
      if (titleSet.has(tile.title)) {
        tile.liked = true;
      } else {
        tile.liked = false;
      }
    }
    setTiles(newArr);
  }

  useEffect(() => {
    updateSearchLikes();
  }, [likedTiles]);

  const handleToggleLike = async (tile: Tile | null) => {
    try {
        const endpoint = tile == null || tile.liked? 'unlike': 'like';
        const body = tile == null? '{}': JSON.stringify(tile);
        console.log(`Hitting endpoint ${endpoint}`)
        const response = await fetch(`http://localhost:80/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: body,
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(`response: ${response}, data: ${JSON.stringify(data)}`)
        // Assuming the response contains a list of JSON objects representing tiles
        setLikedTiles(data);



    } catch (error) {
        console.error('Error:', error);
        // Handle the error as needed, e.g., display an error message to the user
    }
  };

  useEffect(() => {
    handleToggleLike(null);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      height: '100vh',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '50%',
        paddingTop: '20px'
      }}>
        <SearchComponent onSearch={handleSearch} />
        {tiles.map((tile, index) => (
          <TileComponent
            key={index}
            name={tile.name}
            summary={tile.summary}
            status={tile.status}
            publishDate={tile.publishDate}
            owner={tile.owner}
            title={tile.title}
            slug={tile.slug}
            sharingImage1x1Url={tile.sharingImage1x1Url}
            liked={tile.liked}
            onToggleLike={() => handleToggleLike(tile)}
            showLikeButton={true}
          />
        ))}
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '50%',
        paddingTop: '20px',
        borderLeft: '1px solid #000'
      }}>
        <h2>Liked Tiles</h2>
        <RefreshButton></RefreshButton>
        {likedTiles.map((tile, index) => (
          <TileComponent
            key={index}
            name={tile.name}
            summary={tile.summary}
            status={tile.status}
            publishDate={tile.publishDate}
            owner={tile.owner}
            title={tile.title}
            slug={tile.slug}
            sharingImage1x1Url={tile.sharingImage1x1Url}
            liked={tile.liked}
            onToggleLike={() => handleToggleLike(tile)}
            showLikeButton={false}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
