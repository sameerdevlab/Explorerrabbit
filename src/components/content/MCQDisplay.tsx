import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import useContentStore from '../../store/contentStore';

const MCQDisplay: React.FC = () => {
  const { result } = useContentStore();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  
  if (!result || !result.mcqs || result.mcqs.length === 0) return null;
  
  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };
  
  const checkAnswers = () => {
    setShowResults(true);
  };
  
  const resetAnswers = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };
  
  const getScore = () => {
    if (!showResults) return 0;
    
    let correct = 0;
    result.mcqs.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    return correct;
  };
  
  const score = getScore();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <Card className="overflow-hidden bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Test Your Knowledge</h2>
          
          {showResults && (
            <div className={`p-4 mb-4 rounded-md ${
              score === result.mcqs.length 
                ? 'bg-green-100 text-green-800' 
                : score >= result.mcqs.length / 2 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-medium">
                You scored {score} out of {result.mcqs.length}
                {score === result.mcqs.length ? ' - Perfect!' : ''}
              </p>
            </div>
          )}
          
          <div className="space-y-6">
            {result.mcqs.map((question, questionIndex) => (
              <div key={questionIndex} className="border border-gray-200 rounded-md p-4">
                <p className="font-medium mb-3">{question.question}</p>
                
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selectedAnswers[questionIndex] === optionIndex;
                    const isCorrect = question.correctAnswer === optionIndex;
                    
                    // Determine the option styling
                    let optionClass = 'border border-gray-300 p-3 rounded-md transition-colors';
                    
                    if (showResults) {
                      if (isCorrect) {
                        optionClass = 'border border-green-500 bg-green-50 p-3 rounded-md';
                      } else if (isSelected && !isCorrect) {
                        optionClass = 'border border-red-500 bg-red-50 p-3 rounded-md';
                      }
                    } else if (isSelected) {
                      optionClass = 'border border-purple-500 bg-purple-50 p-3 rounded-md';
                    } else {
                      optionClass = 'border border-gray-300 p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer';
                    }
                    
                    return (
                      <div
                        key={optionIndex}
                        className={optionClass}
                        onClick={() => !showResults && handleOptionSelect(questionIndex, optionIndex)}
                      >
                        <div className="flex items-start">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 text-xs mr-2">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <span>{option}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex gap-4">
            {showResults ? (
              <Button onClick={resetAnswers} className="w-full">Try Again</Button>
            ) : (
              <Button 
                onClick={checkAnswers} 
                disabled={Object.keys(selectedAnswers).length !== result.mcqs.length}
                className="w-full"
              >
                Check Answers
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MCQDisplay;