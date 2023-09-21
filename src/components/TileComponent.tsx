import React from 'react';
import { Tile } from '../interfaces/Tile';

interface TileProps extends Tile {
  onToggleLike: () => void;
  showLikeButton?: boolean;
}

export const TileComponent: React.FC<TileProps> = ({ name, title, header, slug, status, publishDate, owner, imageUrl, liked, onToggleLike, showLikeButton }) => {
  console.log('TileComponent Props:', { name, title, header, slug, status, publishDate, owner, imageUrl, liked, onToggleLike, showLikeButton });
  return (
    <div>
      <img src={imageUrl} alt={title} style={{ width: '100px', height: '50px' }} />
      <h2>{title} - {name}</h2>
      <h3>{header}</h3>
      <p>Slug: {slug}</p>
      <p>Status: {status}</p>
      <p>Publish Date: {publishDate.toLocaleDateString()}</p>
      <p>Owner: {owner}</p>
      { showLikeButton && (
        <button onClick={onToggleLike}>{liked ? '❤️' : '♡'}</button>
      )}
    </div>
  );
};
