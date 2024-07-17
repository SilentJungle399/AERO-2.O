// components/SectionToolbar.js
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const SectionToolbar = ({ onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => {
  return (
    <div className="absolute top-2 right-2 flex space-x-2">
      <button
        onClick={onEdit}
        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        <FaEdit />
      </button>
      <button
        onClick={onDelete}
        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
      >
        <FaTrash />
      </button>
      {!isFirst && (
        <button
          onClick={onMoveUp}
          className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
        >
          <FaArrowUp />
        </button>
      )}
      {!isLast && (
        <button
          onClick={onMoveDown}
          className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
        >
          <FaArrowDown />
        </button>
      )}
    </div>
  );
};

export default SectionToolbar;