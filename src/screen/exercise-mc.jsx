import React, { useState } from 'react';
import { Button, Progress, Modal } from '@nextui-org/react';

const MultipleChoiceExercise = () => {
  // Hardcoded question data for the demo
  const questions = [
    {
      question: 'Nature day is in...',
      answers: ['Winter', 'Summer', 'Fall', 'Spring'],
      correctAnswer: 'Spring',
    },
    {
      question: 'Duy is...',
      answers: ['Funny', 'Handsome', 'Generous', 'Gentle'],
      correctAnswer: 'Handsome',
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progress, setProgress] = useState(40); // Initial progress value
  const [showExitModal, setShowExitModal] = useState(false);

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
      setProgress(progress + 10); // Increase progress by 10%
    } else {
      alert('You have completed the demo!');
    }
    // Reset states for the next question
    setIsSubmitted(false);
    setSelectedAnswer(null);
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setProgress(progress + 10); // Increase progress by 10% even when skipping
    } else {
      alert('You have completed the demo!');
    }
    // Reset states for the next question
    setIsSubmitted(false);
    setSelectedAnswer(null);
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    // Logic to navigate back to the main screen
    alert('Returning to the main screen...');
    setShowExitModal(false);
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white">
      {/* Workflow Progress Bar and Exit Button */}
      <div className="w-full flex items-center mb-4">
        <button onClick={handleExit} className="text-gray-500 text-2xl">
          ✖
        </button>
        <Progress
          value={progress}
          color={isSubmitted ? 'warning' : 'primary'}
          className="flex-1 mx-4 h-2 rounded-full bg-gray-200"
        />
        <span className="text-gray-700">{progress}%</span>
      </div>

      <h2 className="text-xl font-bold mb-6">{questionData.question}</h2>

      <div className="space-y-4 w-full flex flex-col items-center">
        {questionData.answers.map((answer, index) => {
          // Determine styles for selected, correct, and incorrect answers
          const isCorrectAnswer = answer === questionData.correctAnswer;
          const isSelected = answer === selectedAnswer;
          const isWrongAnswer = isSubmitted && isSelected && !isCorrectAnswer;

          return (
            <button
              key={index}
              className={`w-1/2 flex items-center p-4 rounded border transition-all ${
                isSelected ? 'border-blue-500' : 'border-gray-300'
              } ${
                isWrongAnswer
                  ? 'bg-red-100'
                  : isSubmitted && isCorrectAnswer
                  ? 'bg-green-100'
                  : 'bg-white'
              }`}
              onClick={() => handleAnswerClick(answer)}
              disabled={isSubmitted}
            >
              <span
                className={`font-bold w-8 h-8 flex items-center justify-center rounded-full border ${
                  isWrongAnswer
                    ? 'border-red-500 text-red-500'
                    : 'border-gray-500 text-gray-500'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="ml-4">{answer}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center items-center mt-16 space-x-40 w-full ">
        <Button flat auto className="bg-gray-200 text-gray-600 mr-80 " onClick={handleSkip}>
          Skip
        </Button>
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

      {/* Exit Confirmation Modal */}
      <Modal open={showExitModal} onClose={handleCancelExit}>
        <Modal.Header>
          <h2>Exit Exercise?</h2>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to exit? Your progress will be lost.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button auto onClick={handleConfirmExit} color="error">
            Yes, Exit
          </Button>
          <Button auto onClick={handleCancelExit}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {isSubmitted && (
        <div
          className={`mt-8 text-lg font-semibold ${
            selectedAnswer === questionData.correctAnswer
              ? 'text-green-500'
              : 'text-red-500'
          }`}
        >
          {selectedAnswer === questionData.correctAnswer
            ? 'Great job!'
            : "Don't give up. Try again!"}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceExercise;
