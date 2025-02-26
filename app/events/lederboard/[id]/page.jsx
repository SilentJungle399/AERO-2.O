'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const LeaderboardApp = () => {
  const { id } = useParams();

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [eventTitle, setEventTitle] = useState('Leaderboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState('Alex Johnson');

  useEffect(() => {
    if (!id) return;

    const fetchLeaderboardData = async () => {
      setLoading(true);
      setLeaderboardData([
        { rank: 1, name: "River Chen", score: 321, bestTime: "1:30.42" },
        { rank: 2, name: "Parker Williams", score: 315, bestTime: "1:30.95" },
        { rank: 3, name: "Quinn Lee", score: 308, bestTime: "1:31.27" },
        { rank: 4, name: "Riley Johnson", score: 294, bestTime: "1:31.89" },
        { rank: 5, name: "Jamie Smith", score: 289, bestTime: "1:32.14" },
        { rank: 6, name: "Taylor Rodriguez", score: 283, bestTime: "1:32.67" },
        { rank: 7, name: "Casey Wu", score: 276, bestTime: "1:33.15" },
        { rank: 8, name: "Morgan Park", score: 265, bestTime: "1:33.56" },
        { rank: 9, name: "Alex Johnson", score: 257, bestTime: "1:34.01" },
        { rank: 10, name: "Jordan Patel", score: 248, bestTime: "1:34.47" }
      ]);
      setLoading(false);
    };

    fetchLeaderboardData();
  }, [id]);

  if (loading) return <div className="text-center text-white">Loading leaderboard data...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-black pt-28 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">{eventTitle}</h1>
      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full text-left border-collapse border border-blue-500">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-4 border border-blue-500">Rank</th>
              <th className="p-4 border border-blue-500">Player</th>
              <th className="p-4 border border-blue-500">Score</th>
              <th className="p-4 border border-blue-500">Best Time</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((player) => (
              <tr
                key={player.rank}
                className={`text-white ${player.name === currentUser ? 'bg-blue-600' : 'bg-blue-950'}`}
              >
                <td className="p-4 border border-blue-500">{player.rank}</td>
                <td className="p-4 border border-blue-500">{player.name}</td>
                <td className="p-4 border border-blue-500">{player.score}</td>
                <td className="p-4 border border-blue-500">{player.bestTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardApp;
