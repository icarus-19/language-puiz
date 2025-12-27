import React from 'react';
import QuizSession from './QuizSession';

const VocabularyQuiz = ({ language }) => {
  const customConfig = {
    title: `${language} Vocabulary Quiz`,
    description: 'Test your word knowledge',
    type: 'vocabulary'
  };

  return <QuizSession language={language} config={customConfig} />;
};

export default VocabularyQuiz;