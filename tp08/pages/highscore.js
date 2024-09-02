// /pages/highscore.js

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Highscore() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    setPlayers(storedPlayers);
  }, []);

  return (
    <div>
      <h1>Puestos</h1>
      <ul>
        {players
          .sort((a, b) => b.score - a.score)
          .map((player, index) => (
            <li key={index}>
              {player.name}: {player.score} Puntos
            </li>
          ))}
      </ul>
      <Link href="/" legacyBehavior>
        <a>Volver al juego</a>
      </Link>
    </div>
  );
}
