import React, { useState } from 'react';
import { Button, Modal } from '@nextui-org/react';

const MultipleChoiceExercise = () => {

  const questions = [
    {
      question: 'Nature day is in...',
      answers: 'A.Winter\\nB.Summer\\nC.Fall\\nD.Spring',
      correctAnswer: 'Spring',
    },
    {
      question: 'Duy is...',
      answers: 'A.Funny\\nB.Handsome\\nC.Generous\\nD.Gentle',
      correctAnswer: 'Handsome',
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questionData = questions[currentQuestionIndex];

  const handleAnswerClick = (answer) => {
    if (!isSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      setIsSubmitted(true);
    }
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert('ĐÃ HOÀN THÀNH!');
    }

    setIsSubmitted(false);
    setSelectedAnswer(null);
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert('You have completed the demo!');
    }

    setIsSubmitted(false);
    setSelectedAnswer(null);
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    alert('Returning to the main screen...');
    setShowExitModal(false);
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const isCorrect = selectedAnswer === questionData.correctAnswer;

  return (
    <div className="flex flex-col items-center p-8 bg-white">
   

      <h2 className="text-xl font-bold mb-6">{questionData.question}</h2>

      <div className="space-y-4 w-full flex flex-col items-center">
        {questionData.answers.split('\\n').map((answer, index) => {
          const optionText = answer.slice(2);
          const isSelected = optionText === selectedAnswer;
          const isWrongAnswer = isSubmitted && isSelected && !isCorrect;

          return (
            <button
              key={index}
              className={`w-1/2 flex items-center p-4 rounded border transition-all ${
                isSelected ? 'border-blue-500' : 'border-gray-300'
              } ${
                isWrongAnswer
                  ? 'bg-red-100'
                  : isSubmitted && optionText === questionData.correctAnswer
                  ? 'bg-green-100'
                  : 'bg-white'
              }`}
              onClick={() => handleAnswerClick(optionText)}
              disabled={isSubmitted}
            >
              <span
                className={`font-bold w-8 h-8 flex items-center justify-center rounded-full border ${
                  isWrongAnswer
                    ? 'border-red-500 text-red-500'
                    : 'border-gray-500 text-gray-500'
                }`}
              >
                {answer.charAt(0)}
              </span>
              <span className="ml-4">{optionText}</span>
            </button>
          );
        })}
      </div>

      <div
        className={`flex flex-col items-center justify-center w-full mt-8 p-8 rounded-lg ${
          isSubmitted
            ? isCorrect
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            : 'bg-blue-100 text-blue-800'
        }`}
      >
        <div className="flex items-center space-x-80">
          {!isSubmitted && (
            <Button flat auto className="bg-gray-200 text-gray-600" onClick={handleSkip}>
              Skip
            </Button>
          )}
          <Button
            auto
            className={`${
              selectedAnswer ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}
            onClick={isSubmitted ? handleContinue : handleSubmit}
            disabled={!selectedAnswer && !isSubmitted}
          >
            {isSubmitted ? 'Continue' : 'Check'}
          </Button>
        </div>

        {isSubmitted && (
          <div className="mt-4 text-lg font-semibold">
            {isCorrect ? 'Great job!' : "Don't give up. Try again!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleChoiceExercise;