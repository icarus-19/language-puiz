import React from 'react';
import QuizSession from './QuizSession';

const GrammarQuiz = ({ language }) => {
  const customConfig = {
    title: `${language} Grammar Quiz`,
    description: 'Practice grammar rules',
    type: 'grammar'
  };

  return <QuizSession language={language} config={customConfig} />;
};

export default GrammarQuiz;