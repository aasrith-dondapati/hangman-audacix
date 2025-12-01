import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [guessLetter, setGuessLetter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastGuessResult, setLastGuessResult] = useState(null);

  // Start a new game
  const startNewGame = async () => {
    setLoading(true);
    setError('');
    setLastGuessResult(null);
    try {
      const response = await fetch(`${API_BASE_URL}/game/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to create new game');
      }
      
      const data = await response.json();
      setGameId(data.id);
      await fetchGameState(data.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current game state
  const fetchGameState = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/game/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch game state');
      }
      const data = await response.json();
      setGameState(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Make a guess
  const handleGuess = async (e) => {
    e.preventDefault();
    
    if (!gameId || !guessLetter) {
      return;
    }

    if (guessLetter.length !== 1 || !/^[a-zA-Z]$/.test(guessLetter)) {
      setError('Please enter a single letter');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/game/${gameId}/guess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ letter: guessLetter }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to make guess');
        return;
      }

      setGameState({
        status: data.status,
        word_state: data.word_state,
        incorrect_guesses_made: data.incorrect_guesses_made,
        incorrect_guesses_remaining: data.incorrect_guesses_remaining,
      });
      
      setLastGuessResult(data.correct);
      setGuessLetter('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh game state if game is in progress
  useEffect(() => {
    if (gameId && gameState && gameState.status === 'InProgress') {
      const interval = setInterval(() => {
        fetchGameState(gameId);
      }, 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, gameState?.status]);

  return (
    <div className="App">
      <div className="container">
        <h1>Hangman Game</h1>
        
        {!gameId ? (
          <div className="start-screen">
            <p>Welcome to Hangman! Click the button below to start a new game.</p>
            <button 
              onClick={startNewGame} 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Starting...' : 'Start New Game'}
            </button>
          </div>
        ) : (
          <div className="game-screen">
            <div className="game-info">
              <div className="status-badge">
                Status: <span className={`status-${gameState?.status.toLowerCase()}`}>
                  {gameState?.status}
                </span>
              </div>
              <div className="guesses-info">
                <p>Incorrect guesses: {gameState?.incorrect_guesses_made} / {gameState?.incorrect_guesses_made + gameState?.incorrect_guesses_remaining}</p>
                <p>Remaining: {gameState?.incorrect_guesses_remaining}</p>
              </div>
            </div>

            <div className="word-display">
              {gameState?.word_state.split('').map((char, index) => (
                <span key={index} className="word-letter">
                  {char}
                </span>
              ))}
            </div>

            {lastGuessResult !== null && (
              <div className={`guess-feedback ${lastGuessResult ? 'correct' : 'incorrect'}`}>
                {lastGuessResult ? '✓ Correct!' : '✗ Incorrect!'}
              </div>
            )}

            {gameState?.status === 'InProgress' && (
              <form onSubmit={handleGuess} className="guess-form">
                <input
                  type="text"
                  value={guessLetter}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (value.length <= 1 && /^[A-Z]*$/.test(value)) {
                      setGuessLetter(value);
                      setError('');
                    }
                  }}
                  placeholder="Enter a letter"
                  maxLength="1"
                  disabled={loading}
                  className="guess-input"
                  autoFocus
                />
                <button 
                  type="submit" 
                  disabled={loading || !guessLetter}
                  className="btn btn-guess"
                >
                  {loading ? 'Guessing...' : 'Guess'}
                </button>
              </form>
            )}

            {gameState?.status === 'Won' && (
              <div className="game-result won">
                <h2>🎉 Congratulations! You Won!</h2>
                <p>The word was: <strong>{gameState?.word_state}</strong></p>
                <button onClick={startNewGame} className="btn btn-primary">
                  Play Again
                </button>
              </div>
            )}

            {gameState?.status === 'Lost' && (
              <div className="game-result lost">
                <h2>😞 Game Over! You Lost!</h2>
                <button onClick={startNewGame} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              onClick={startNewGame} 
              className="btn btn-secondary"
              style={{ marginTop: '20px' }}
            >
              New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
