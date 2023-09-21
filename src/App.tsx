import React, { useState } from 'react';
import { Tile } from './interfaces/Tile'
import { SearchComponent } from './components/SearchComponent';
import { TileComponent } from './components/TileComponent';

export const App: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);

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
            name: tile.name || 'Unknown', // Using 'Unknown' as a fallback value since name properties are null in your JSON
            title: tile.title,
            header: tile.header || 'No Header', // Similarly, using a fallback for header
            slug: tile.slug.current,
            status: tile.status,
            publishDate: new Date(tile.publishDate),
            owner: tile.owner,
            imageUrl: "https://cdn11.bigcommerce.com/s-hii7479o/images/stencil/original/products/13186/31212/sunglasses__57285.1558039245.png?c=2", // Keeping this as is, since imageUrl is not present in your JSON
            liked: false,
        })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleToggleLike = (index: number) => {
    const newTiles = [...tiles];
    newTiles[index].liked = !newTiles[index].liked;
    setTiles(newTiles);

  };

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
            header={tile.header}
            status={tile.status}
            publishDate={tile.publishDate}
            owner={tile.owner}
            title={tile.title}
            slug={tile.slug}
            imageUrl={"https://cdn11.bigcommerce.com/s-hii7479o/images/stencil/original/products/13186/31212/sunglasses__57285.1558039245.png?c=2"}
            liked={tile.liked}
            onToggleLike={() => handleToggleLike(index)}
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
        {tiles.filter(tile => tile.liked).map((tile, index) => (
          <TileComponent
            key={index}
            name={tile.name}
            header={tile.header}
            status={tile.status}
            publishDate={tile.publishDate}
            owner={tile.owner}
            title={tile.title}
            slug={tile.slug}
            imageUrl={"https://cdn11.bigcommerce.com/s-hii7479o/images/stencil/original/products/13186/31212/sunglasses__57285.1558039245.png?c=2"}
            liked={tile.liked}
            onToggleLike={() => handleToggleLike(index)}
            showLikeButton={false}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
