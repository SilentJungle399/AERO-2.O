// components/BlogSection.js
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import DraggableSection from './DraggableSection';
import SectionToolbar from './SectionToolbar';

const DynamicColorPicker = dynamic(() => import('./ColorPicker'), { ssr: false });
const DynamicRichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const firebaseConfig = require("../../../../Backend/Firebseconfig/FirebaseConfig.js");
// Initialize Firebase
initializeApp(firebaseConfig);
const storage = getStorage();

const BlogSection = ({ section, index, updateSection, moveSection, deleteSection, isFirst, isLast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSection, setEditedSection] = useState(section);
  const [selectedImage, setSelectedImage] = useState(null);

  //
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const uploadImageToFirebase = async (file) => {
    if (!file) return null;

    const storageRef = ref(storage, `blog-images/${file.name}`);
    await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSave = async () => {
    let imageUrl = editedSection.image;
    if (selectedImage) {
      imageUrl = await uploadImageToFirebase(selectedImage);
    }

    const updatedSection = { ...editedSection, image: imageUrl };
    updateSection(index, updatedSection);
    setIsEditing(false);
    setSelectedImage(null);
  };
  //



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSection({ ...editedSection, [name]: value });
  };

  const handleColorChange = (color) => {
    setEditedSection({ ...editedSection, headingColor: color });
  };

  const handleContentChange = (content) => {
    setEditedSection({ ...editedSection, content });
  };

  const handleImagePositionChange = (position) => {
    setEditedSection({ ...editedSection, imagePosition: position });
  };

  // const handleSave = () => {
  //   updateSection(index, editedSection);
  //   setIsEditing(false);
  // };

  const handleMoveUp = () => {
    moveSection(index, index - 1);
  };

  const handleMoveDown = () => {
    moveSection(index, index + 1);
  };

  return (
    <DraggableSection id={section.id} index={index} moveSection={moveSection}>
      <div className="relative p-6 border-b border-gray-200 ">
        {isEditing ? (
          <div className="space-y-9">
            <input
              type="text"
              name="headingText"
              value={editedSection.headingText}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Heading Text"
            />
            <DynamicColorPicker
              color={editedSection.headingColor}
              onChange={handleColorChange}
              label="Heading Color"
            />
            <div>

            <DynamicRichTextEditor
              content={editedSection.content}
              onChange={handleContentChange}
            />
                </div>
            <div className="flex items-center space-x-4">
                <div className='mt-12 space-x-3'>
                    
              <label className="font-semibold">Image Position:</label>
              {['left', 'right', 'top', 'bottom'].map((position) => (
                <button
                  key={position}
                  onClick={() => handleImagePositionChange(position)}
                  className={`px-3 py-1 rounded ${
                    editedSection.imagePosition === position
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {position}
                </button>
              ))}
                </div>
            </div>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2
              style={{ color: section.headingColor }}
              className="text-2xl font-bold mb-4"
            >
              {section.headingText}
            </h2>
            <div
              className={`flex ${
                section.imagePosition === 'right' ? 'flex-row-reverse' : 'flex-row'
              } ${
                section.imagePosition === 'top' || section.imagePosition === 'bottom'
                  ? 'flex-col'
                  : ''
              }`}
            >
              <div
                className={`${
                  section.imagePosition === 'left' || section.imagePosition === 'right'
                    ? 'w-1/2'
                    : 'w-full'
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
              {section.image && (
                <div
                  className={`${
                    section.imagePosition === 'left' || section.imagePosition === 'right'
                      ? 'w-1/2'
                      : 'w-full'
                  }`}
                >
                  <Image
                    src={section.image}
                    alt="Section image"
                    width={500}
                    height={300}
                    layout="responsive"
                    objectFit="cover"
                  />
                </div>
              )}
            </div>
            <SectionToolbar
              onEdit={() => setIsEditing(true)}
              onDelete={() => deleteSection(index)}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              isFirst={isFirst}
              isLast={isLast}
            />
          </div>
        )}
      </div>
    </DraggableSection>
  );
};

export default BlogSection;