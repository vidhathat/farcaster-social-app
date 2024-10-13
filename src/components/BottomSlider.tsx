import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AutoComplete from "react-google-autocomplete";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

let placesTypes = "(accounting) (airport) (amusement_park) (aquarium) (art_gallery) (atm) (bakery) (bank) (bar) (beauty_salon) (bicycle_store) (book_store) (bowling_alley) (bus_station) (cafe) (campground) (car_dealer) (car_rental) (car_repair) (car_wash) (casino) (cemetery) (church) (city_hall) (clothing_store) (convenience_store) (courthouse) (dentist) (department_store) (doctor) (drugstore) (electrician) (electronics_store) (embassy) (fire_station) (florist) (funeral_home) (furniture_store) (gas_station) (gym) (hair_care) (hardware_store) (hindu_temple) (home_goods_store) (hospital) (insurance_agency) (jewelry_store) (laundry) (lawyer) (library) (light_rail_station) (liquor_store) (local_government_office) (locksmith) (lodging) (meal_delivery) (meal_takeaway) (mosque) (movie_rental) (movie_theater) (moving_company) (museum) (night_club) (painter) (park) (parking) (pet_store) (pharmacy) (physiotherapist) (plumber) (police) (post_office) (primary_school) (real_estate_agency) (restaurant) (roofing_contractor) (rv_park) (school) (secondary_school) (shoe_store) (shopping_mall) (spa) (stadium) (storage) (store) (subway_station) (supermarket) (synagogue) (taxi_stand) (tourist_attraction) (train_station) (transit_station) (travel_agency) (university) (veterinary_care) (zoo)"

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
  const { isConnected } = useAccount();

  useEffect(() => {
    setIsFormValid(location.trim() !== '' && description.trim() !== '');
  }, [location, description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    let photoUrl = ""
    let fileName = `${Date.now()}-${imageFile?.name}`
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
        {!isConnected ? (
          <motion.div className="absolute bottom-0 left-0 right-0 bg-[#181A1D] rounded-t-3xl px-6 py-12 flex flex-col items-center justify-center">
            <ConnectButton />
            <p className="text-white text-center mt-4">Connect your wallet to post</p>
          </motion.div>
        ) : (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-[#181A1D] rounded-t-3xl p-6"
          style={{ height: '60%' }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex flex-col h-full">
            <AutoComplete
              options={{
                types: placesTypes,
              }}
              apiKey={"AIzaSyDPH2FuK1mcBg72T6rFqvCghvdHagjJvEs"}
              onPlaceSelected={(place) => {
                console.log(place);
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
        )}
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </>
  );
};

export default BottomSlider;
