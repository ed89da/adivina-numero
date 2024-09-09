import React, { useState } from 'react';
import './App.css';

function App() {
  const [guess, setGuess] = useState('');
  const [number, setNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [attempts, setAttempts] = useState(0);
  const [highScore, setHighScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showBubbles, setShowBubbles] = useState(false); // Controla la visualización de los globos
  const maxAttempts = 10;
  const closeThreshold = 4;

  // Cargar los archivos de sonido desde la carpeta 'sonidos'
  const successSound = new Audio('/sonidos/numeroacertado.mp3');
  const errorSound = new Audio('/sonidos/juegoperdido.mp3');

  const handleChange = (e) => {
    setGuess(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userGuess = parseInt(guess, 10);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      setFeedback('Por favor, ingresa un número entre 1 y 100.');
      if (errorSound) errorSound.play();
      return;
    }

    if (attempts >= maxAttempts) {
      setFeedback(`¡Número máximo de intentos alcanzado! El número era ${number}.`);
      if (errorSound) errorSound.play();
      resetGame();
      return;
    }

    const remainingAttempts = maxAttempts - (attempts + 1);
    setAttempts(attempts + 1);

    const difference = Math.abs(userGuess - number);

    if (userGuess === number) {
      setFeedback(`¡Felicidades! Has acertado el número en ${attempts + 1} intentos!`);
      setShowBubbles(true); // Mostrar los globos
      if (successSound) successSound.play();
      if (highScore === null || attempts < highScore) {
        setHighScore(attempts + 1);
      }
      setTimeout(() => {
        resetGame();
        setShowBubbles(false); // Ocultar los globos después de reiniciar el juego
      }, 5000); // Ocultar después de 5 segundos
    } else if (difference <= closeThreshold) {
      setFeedback(`¡Estás muy cerca! ${userGuess < number ? 'Intenta un número un poco mayor.' : 'Intenta un número un poco menor.'} Tienes ${remainingAttempts} oportunidad${remainingAttempts === 1 ? '' : 'es'} restantes.`);
      if (errorSound) errorSound.play();
    } else if (userGuess < number) {
      setFeedback(`¡Demasiado bajo! Tienes ${remainingAttempts} oportunidad${remainingAttempts === 1 ? '' : 'es'} restantes.`);
      if (errorSound) errorSound.play();
    } else {
      setFeedback(`¡Demasiado alto! Tienes ${remainingAttempts} oportunidad${remainingAttempts === 1 ? '' : 'es'} restantes.`);
      if (errorSound) errorSound.play();
    }

    // Verifica si se llegó a 0 intentos restantes
    if (remainingAttempts === 0) {
      setFeedback(`¡Se acabaron los intentos! El número era ${number}.`);
      if (errorSound) errorSound.play();
      resetGame();
    }
  };

  const resetGame = () => {
    setNumber(Math.floor(Math.random() * 100) + 1);
    setAttempts(0);
    setGuess('');
    setFeedback(''); // Limpiar el mensaje de feedback
  };

  return (
    <div className="App">
      <h1>Adivina el Número</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={guess}
          onChange={handleChange}
          placeholder="Ingresa tu adivinanza"
        />
        <button type="submit">Enviar Número</button>
      </form>
      <p>{feedback}</p>
      {highScore !== null && <p>Puntaje Más Alto: {highScore} intentos</p>}
      <button onClick={resetGame}>Comenzar Nuevo Juego</button>
      {showBubbles && (
        <div className="bubbles">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>
      )}
    </div>
  );
}

export default App;
