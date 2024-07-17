import { useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicColorPicker = dynamic(() => import('./ColorPicker'), { ssr: false });
const DynamicRichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

const AddSectionModal = ({ isOpen, onClose, onAdd }) => {
  const [newSection, setNewSection] = useState({
    id: Date.now().toString(),
    headingText: '',
    headingColor: '#000000',
    headingSize: 'h1', // Defaulting to h1
    content: '',
    contentStyle: {
      fontFamily: '',
      fontSize: '',
      fontWeight: '',
      fontStyle: '',
      textAlign: 'left', // Defaulting to left
      lineHeight: '',
      color: '#000000',
    },
    backgroundColor: '#ffffff',
    padding: '',
    margin: '',
    borderRadius: '',
    image: '',
    imagePosition: 'right', // Defaulting to right
    imageStyle: {
      width: '',
      height: '',
      objectFit: 'cover', // Defaulting to cover
      opacity: 1, // Defaulting to fully opaque
    },
    lists: [],
    quotes: [],
    codeBlocks: [],
    tables: [],
    customCSS: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection({ ...newSection, [name]: value });
  };

  const handleColorChange = (color) => {
    setNewSection({ ...newSection, headingColor: color });
  };

  const handleContentChange = (content) => {
    setNewSection({ ...newSection, content });
  };

  const handleImagePositionChange = (position) => {
    setNewSection({ ...newSection, imagePosition: position });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newSection);
    setNewSection({
      id: Date.now().toString(),
      headingText: '',
      headingColor: '#000000',
      headingSize: 'h1', // Defaulting to h1
      content: '',
      contentStyle: {
        fontFamily: '',
        fontSize: '',
        fontWeight: '',
        fontStyle: '',
        textAlign: 'left', // Defaulting to left
        lineHeight: '',
        color: '#000000',
      },
      backgroundColor: '#ffffff',
      padding: '',
      margin: '',
      borderRadius: '',
      image: '',
      imagePosition: 'right', // Defaulting to right
      imageStyle: {
        width: '',
        height: '',
        objectFit: 'cover', // Defaulting to cover
        opacity: 1, // Defaulting to fully opaque
      },
      lists: [],
      quotes: [],
      codeBlocks: [],
      tables: [],
      customCSS: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-300 rounded-lg p-4 w-full max-w-xl max-h-full overflow-y-auto">
        <h2 className="text-2xl text-blue-500 font-bold">Add New Section</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Heading Text</label>
            <input
              type="text"
              name="headingText"
              value={newSection.headingText}
              onChange={handleInputChange}
              className="mt-1 block w-full border text-gray-800 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Heading Color</label>
            <DynamicColorPicker
              color={newSection.headingColor}
              onChange={handleColorChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <DynamicRichTextEditor
              content={newSection.content}
              onChange={handleContentChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image Position</label>
            <div className="mt-1 flex space-x-4">
              {['left', 'right', 'top', 'bottom'].map((position) => (
                <button
                  key={position}
                  type="button"
                  onClick={() => handleImagePositionChange(position)}
                  className={`px-3 py-1 rounded ${
                    newSection.imagePosition === position
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              onChange={(e) => {
                // Handle image upload
                // You may want to use a service like Cloudinary or S3 for image hosting
              }}
              className="mt-1 block w-full text-gray-800"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSectionModal;
