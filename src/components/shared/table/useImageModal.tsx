import { useState } from 'react';

export const useImageModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageToShow, setImageToShow] = useState<string | null>(null);

  const handleImageClick = (src: string) => {
    setImageToShow(src);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setImageToShow(null);
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    imageToShow,
    handleImageClick,
    handleCloseModal,
  };
};