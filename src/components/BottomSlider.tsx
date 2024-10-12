import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AutoComplete from "react-google-autocomplete";

interface BottomSliderProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (location: string, description: string, photoUrl: string) => Promise<void>;
}

const BottomSlider: React.FC<BottomSliderProps> = ({ isOpen, onClose, onPost }) => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(location.trim() !== '' && description.trim() !== '');
  }, [location, description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    let photoUrl = ""
    let fileName = `${imageFile?.name}-${Date.now()}`
    try {
      if (imageFile != null) {
        const { data, error } = await supabase.storage
          .from('Images')
          .upload(fileName, imageFile);

        if (error) {
          console.error('Error uploading file:', error);
          toast.error('Error uploading image');
          setIsLoading(false);
          return;
        }
        
        let fileURL = supabase.storage
          .from('Images')
          .getPublicUrl(fileName);
          photoUrl = fileURL.data.publicUrl
      }

      await onPost(location, description, photoUrl);
      toast.success('Post created successfully!');
      setLocation('');
      setDescription('');
      setPhotoUrl('');
      setImageFile(null);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error creating post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('photourl', reader.result);
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50">
        <div 
          className="absolute inset-0"
          onClick={onClose}
        />
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-[#181A1D] rounded-t-3xl p-6"
          style={{ height: '60%' }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex flex-col h-full">
            <AutoComplete
            apiKey={"AIzaSyDPH2FuK1mcBg72T6rFqvCghvdHagjJvEs"}
            onPlaceSelected={(place) => {
                console.log(place?.formatted_address);
                setLocation(place?.formatted_address || "");
              }}
              className="mb-4 p-2 border border-[#3F3F3F] rounded-xl py-4 px-6 bg-[#181A1D] text-white"
            />
            <textarea
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-grow mb-4 p-2 border border-[#3F3F3F] rounded-xl py-4 px-6 resize-none bg-[#181A1D] text-white"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4 p-2 border border-[#3F3F3F] rounded-xl py-4 px-6 bg-[#181A1D] text-white"
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid}
              className={`bg-[#FF8181] text-black font-bold px-6 py-4 rounded-full ${(isLoading || !isFormValid) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </motion.div>
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </>
  );
};

export default BottomSlider;
