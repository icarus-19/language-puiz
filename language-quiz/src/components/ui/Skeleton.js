import React from 'react';
import './Skeleton.css';

const Skeleton = ({ 
  type = 'text',
  width = '100%',
  height = '20px',
  className = ''
}) => {
  return (
    <div 
      className={`skeleton skeleton-${type} ${className}`}
      style={{ width, height }}
    />
  );
};

export const CardSkeleton = () => (
  <div className="card-skeleton">
    <Skeleton type="text" width="60%" height="24px" />
    <Skeleton type="text" width="100%" height="16px" />
    <Skeleton type="text" width="100%" height="16px" />
    <Skeleton type="text" width="40%" height="16px" />
  </div>
);

export const QuizSkeleton = () => (
  <div className="quiz-skeleton">
    <Skeleton type="text" width="40%" height="32px" />
    <Skeleton type="text" width="100%" height="48px" />
    <div className="options-skeleton">
      <Skeleton type="button" height="60px" />
      <Skeleton type="button" height="60px" />
      <Skeleton type="button" height="60px" />
      <Skeleton type="button" height="60px" />
    </div>
  </div>
);

export default Skeleton;