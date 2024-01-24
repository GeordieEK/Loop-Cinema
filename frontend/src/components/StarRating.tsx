import { useState } from 'react';
import './styles/StarRating.css';
import { FaStar } from 'react-icons/fa';

interface StarProps {
  value: number;
  filled: boolean;
  editable: boolean;
  onClick: () => void;
  onMouseOver: () => void;
  onMouseLeave: () => void;
}

function Star({
  filled,
  onClick,
  editable,
  onMouseOver,
  onMouseLeave,
}: StarProps) {
  return (
    <FaStar
      color={filled ? 'orange' : 'lightgray'}
      onClick={editable ? onClick : null}
      className="star-icon"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    />
  );
}

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  editable: boolean;
}

function StarRating({ rating, setRating, editable }: StarRatingProps) {
  const [selection, setSelection] = useState(rating);
  const maxRating = 5;

  const handleRating = (index: number) => {
    if (editable) setRating(index + 1);
  };

  const handleMouseOver = (index: number) => {
    if (editable) setSelection(index + 1);
  };

  const handleMouseLeave = () => {
    if (editable) setSelection(rating);
  };

  return (
    <div>
      {Array(maxRating)
        .fill(undefined)
        .map((_, index) => (
          <Star
            key={`star-${index}`}
            value={index}
            editable={editable}
            filled={index < (rating || selection)}
            onClick={() => handleRating(index)}
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
    </div>
  );
}

export default StarRating;
