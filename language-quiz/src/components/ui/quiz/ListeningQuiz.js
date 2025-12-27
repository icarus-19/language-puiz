import React from 'react';
import QuizSession from './QuizSession';

const ListeningQuiz = ({ language }) => {
  const customConfig = {
    title: `${language} Listening Quiz`,
    description: 'Audio comprehension',
    type: 'listening',
    hasAudio: true
  };

  return <QuizSession language={language} config={customConfig} />;
};

export default ListeningQuiz;