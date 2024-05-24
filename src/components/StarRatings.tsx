import React from 'react';

interface StarRatingProps {
  rating: number;
  reviews: number;
}
const StarRating = ({ rating, reviews }: StarRatingProps) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<i key={i} className='material-icons icon-fill'>star</i>);
    } else if (i <= rating + 0.5) {
      stars.push(<i key={i} className='material-icons icon-fill'>star_half</i>);
    } else {
      stars.push(<i key={i} className='material-icons icon-fill'>star_border</i>);
    }
  }

  return (
    <div className='star-rating'>
      {stars}
      <span className='sans-serif'>({reviews})</span>
    </div>)
};

export default StarRating;
