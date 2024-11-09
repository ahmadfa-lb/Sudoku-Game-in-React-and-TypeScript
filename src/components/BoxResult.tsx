// import React from 'react';
// import '../index.css'
// import lostGif from '../assets/lost.gif';


// interface BoxResultProps {
//     resetGame: () => void; // Accept resetGame as a prop
//   }

//   const BoxResult: React.FC<BoxResultProps> = ({ resetGame }) => {
//     return (
//       <div className="game-modal show">
//         <div className="content">
//           <img src={lostGif} alt="Game over" />
//           <button className="play-again" onClick={resetGame}>Play Again</button>
//         </div>
//       </div>
//     );
//   };

// export default BoxResult;

// BoxResult.tsx (No changes needed from previous)
import React from 'react';
import '../index.css';
import lostGif from '../assets/lost.gif';
import victoryGif from '../assets/victory.gif'; // Import victory.gif

interface BoxResultProps {
  resetGame: () => void;
  gameResult: 'win' | 'lose'; // Use 'win' or 'lose' to determine the result
}

const BoxResult: React.FC<BoxResultProps> = ({ resetGame, gameResult }) => {
  return (
    <div className="game-modal show">
      <div className="content">
        <img 
          src={gameResult === 'win' ? victoryGif : lostGif} 
          alt={gameResult === 'win' ? 'Victory' : 'Game Over'} 
        />
        <button className="play-again" onClick={resetGame}>Play Again</button>
      </div>
    </div>
  );
};

export default BoxResult;

