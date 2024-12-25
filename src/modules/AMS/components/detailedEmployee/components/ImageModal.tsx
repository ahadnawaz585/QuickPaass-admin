import React from 'react';
import '../styles/ImageModal.scss';

interface ImageModalProps {
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, alt, onClose }) => {
  return (
    <div className="image-modal" onClick={onClose}>
      <div className="image-modal__content" onClick={e => e.stopPropagation()}>
        <button className="image-modal__close" onClick={onClose}>×</button>
        <img src={imageUrl} alt={alt} className="image-modal__image" />
      </div>
    </div>
  );
};

export default ImageModal;