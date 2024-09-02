// /pages/index.js

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(15);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function fetchCountries() {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
      const data = await res.json();
      setCountries(data.data);
      selectRandomCountry(data.data);
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    if (isPlaying && timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleTimeOut();
    }
  }, [timer, isPlaying]);

  const selectRandomCountry = (countriesList) => {
    const randomIndex = Math.floor(Math.random() * countriesList.length);
    setSelectedCountry(countriesList[randomIndex]);
    setGuess('');
    setMessage('');
    setTimer(15);
    setIsPlaying(true);
  };

  const handleGuess = () => {
    if (guess.toLowerCase() === selectedCountry.name.toLowerCase()) {
      setScore(score + 10);
      setMessage('Correct!');
    } else {
      setScore(score - 1);
      setMessage('Incorrect! Try again.');
    }
    selectRandomCountry(countries);
  };

  const handleTimeOut = () => {
    setScore(score + timer);
    setMessage('Time out! Moving to next flag.');
    selectRandomCountry(countries);
  };

  const handlePlayerSubmit = () => {
    if (currentPlayer) {
      const newPlayer = { name: currentPlayer, score };
      const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
      const updatedPlayers = [...storedPlayers, newPlayer];
      localStorage.setItem('players', JSON.stringify(updatedPlayers));
      setPlayers(updatedPlayers);
      setCurrentPlayer('');
      setScore(0);
      setIsPlaying(false);
    }
  };

  if (!selectedCountry) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Adivina la bandera</h1>
      <img src={selectedCountry.flag} alt="Bandera" />
      <div>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Nombre del pais"
        />
      </div>
      <button onClick={handleGuess}>Enviar</button>
      <h2>Puntuacion: {score}</h2>
      <p>Tiempo restante: {timer} segundos</p>
      {message && <p>{message}</p>}

      <div>
        <input
          type="text"
          value={currentPlayer}
          onChange={(e) => setCurrentPlayer(e.target.value)}
          placeholder="Nombre de usuario"
        />
        <button onClick={handlePlayerSubmit}>Guardar puntuacion</button>
      </div>
      <Link href="/highscore" legacyBehavior>
        <a>Ver puntuaciones mas altas</a>
      </Link>
    </div>
  );
}
