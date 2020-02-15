import React from 'react';

import './ListItem.css';

const ListItem = ({ name, description, imageUrl }) => {
  return (
    <div className="item">
      <div className="item__image-wrapper">
        <img className="item__image" src={imageUrl} alt={name} />
      </div>
      <div className="item__info">
        <h3 className="item__name">{name}</h3>
        <p className="item__description">{description}</p>
      </div>
    </div>
  );
};

export default ListItem;
