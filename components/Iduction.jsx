import React, {useEffect, useState} from 'react';
import Loader from '@/components/Loader'

const InductionSessionsList = () => {
  const [inductionSessions, setInductionSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInductionSessions = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'production'
          ? ""
          : 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/users/getallinduction`);
        if (!response.ok) {
          throw new Error('Failed to fetch induction sessions');
        }
        const data = await response.json();
        console.log(data);
        setInductionSessions(data);
      } catch (error) {
        console.error('Error fetching induction sessions:', error.message);
      } finally {
        setLoading(false); // Set loading to false whether fetch succeeds or fails
      }
    };

    fetchInductionSessions();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  // Sort induction sessions by nearest I_date
  const sortedSessions = [...inductionSessions].sort((a, b) => {
    const dateA = new Date(a.I_date);
    const dateB = new Date(b.I_date);
    return dateA - dateB;
  });

  if (loading) {
    return <Loader/> // Display a loading indicator while data is being fetched
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sortedSessions.map(session => (
        <div key={session._id} className="border rounded-lg overflow-hidden shadow-md">
          {/* Assuming a placeholder image */}
          <img src="/images/induction-placeholder.jpg" alt="Induction Session" className="w-full h-40 object-cover"/>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{session.I_date}</h3>
            <p className="text-sm mb-2">Venue: {session.I_venue}</p>
            <p className="text-sm mb-2">Timing: {session.I_timing}</p>
            <p className="text-sm mb-4">Description: {session.I_description}</p>
            <ul className="text-sm">
              {session.questions.map(q => (
                <li key={q._id} className="mb-1">{q.question}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InductionSessionsList;
