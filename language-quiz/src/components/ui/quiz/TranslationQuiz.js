import React from 'react';
import QuizSession from './QuizSession';

const TranslationQuiz = ({ language }) => {
  const customConfig = {
    title: `${language} Translation Quiz`,
    description: 'Translate sentences',
    type: 'translation'
  };

  return <QuizSession language={language} config={customConfig} />;
};

export default TranslationQuiz;