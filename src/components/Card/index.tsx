
import React from 'react';

type CardProps = {
  value: number | string;
  isRevealed: boolean;
  highlight: boolean;
  onClick: () => void;
};

const Card: React.FC<CardProps> = ({ value, isRevealed, highlight, onClick }) => {
  return (
    <div
      className={`card ${isRevealed ? 'revealed' : ''} ${highlight ? 'highlight' : ''}`}
      onClick={onClick}
    >
      {isRevealed ? (
        typeof value === 'string' ? (
          <img src={value} alt="icon" className="card-icon" />
        ) : (
          value
        )
      ) : (
        ''
      )}
    </div>
  );
};

export default Card;

