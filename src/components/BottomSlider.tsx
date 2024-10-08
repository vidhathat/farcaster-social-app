import React, { useState } from 'react';

interface BottomSliderProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (location: string, note: string, description: string) => void;
}

const BottomSlider: React.FC<BottomSliderProps> = ({ isOpen, onClose, onPost }) => {
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [description, setDescription] = useState('');

  const handlePost = () => {
    onPost(location, note, description);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 bg-[#181A1D] rounded-t-3xl p-6"
        style={{ height: '60%' }}
      >
        <div className="flex flex-col h-full">
          <input
            type="text"
            placeholder="Location of post"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mb-4 p-2 border border-[#3F3F3F] rounded-xl py-4 px-6 bg-[#181A1D]"
          />
          <input
            type="text"
            placeholder="Add a note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-4 p-2 border border-[#3F3F3F] rounded-xl py-4 px-6 bg-[#181A1D]"
          />
          <textarea
            placeholder="Add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-grow mb-4 p-2 border border-[#3F3F3F] rounded-xl py-4 px-6 resize-none bg-[#181A1D]"
          />
          <button
            onClick={handlePost}
            className="bg-[#FF8181] text-black font-bold px-6 py-4 rounded-full"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomSlider;