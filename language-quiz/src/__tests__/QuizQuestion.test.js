import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizQuestion from '../components/quiz/QuizQuestion';

describe('QuizQuestion Component', () => {
  const mockProps = {
    question: 'What is the Spanish word for house?',
    options: ['Casa', 'Perro', 'Libro', 'Mesa'],
    questionNumber: 1,
    totalQuestions: 10,
    onAnswerSelect: jest.fn()
  };

  test('renders question and options correctly', () => {
    render(<QuizQuestion {...mockProps} />);
    
    expect(screen.getByText(mockProps.question)).toBeInTheDocument();
    mockProps.options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test('calls onAnswerSelect when option is clicked', () => {
    render(<QuizQuestion {...mockProps} />);
    
    const firstOption = screen.getByText('Casa');
    fireEvent.click(firstOption);
    
    expect(mockProps.onAnswerSelect).toHaveBeenCalledWith('Casa');
  });

  test('shows progress bar with correct percentage', () => {
    render(<QuizQuestion {...mockProps} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 10%'); // 1/10 = 10%
  });
});
