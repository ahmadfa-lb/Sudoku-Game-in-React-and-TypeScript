// NumberButtons.tsx
import React from 'react';
import '../index.css'; // Specific styles for the buttons

interface NumbersBtnsProps {
  onNumberClick: (number: string) => void;
}

const NumbersBtns: React.FC<NumbersBtnsProps> = ({ onNumberClick }) => {
  return (
    <div className="number-buttons">
      {Array.from({ length: 9 }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => onNumberClick((index + 1).toString())}
          className="number-button"
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};


export default NumbersBtns;
