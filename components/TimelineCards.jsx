import { motion } from 'framer-motion';
import Link from 'next/link';

const TimelineCard = ({ meet, index }) => {
  return (
    <motion.div
      className="mb-8 flex"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex flex-col items-center mr-4">
        <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
        <div className="h-full w-0.5 bg-indigo-600"></div>
      </div>
      <div className="bg-gray-800 p-6 text-white rounded-lg shadow-lg flex-grow">
        <h2 className="text-2xl font-semibold mb-4">{meet.meet_team_type} Meet</h2>
        <p><strong>Date:</strong> {new Date(meet.meet_date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {meet.meet_time}</p>
        <p><strong>Venue:</strong> {meet.meet_venue}</p>
        <p><strong>Mode:</strong> {meet.meet_mode}</p>
        <p className="mt-4">{meet.meet_description}</p>
        <Link href={`/admin/meets/${meet._id}`}>
          <button className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300">
            View Analytics
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default TimelineCard;
