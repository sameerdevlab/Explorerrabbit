import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import useContentStore from '../../store/contentStore';

const MCQDisplay: React.FC = () => {
  const { currentMcqs, isGeneratingMcqs, error } = useContentStore();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  
  console.log('🔍 MCQDisplay render:', { 
    currentMcqs, 
    isGeneratingMcqs, 
    mcqCount: currentMcqs?.length || 0,
    error 
  });
  
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
    if (!showResults || !currentMcqs) return 0;
    
    let correct = 0;
    currentMcqs.forEach((question, index) => {
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
      className="w-full h-full"
    >
      <Card className="h-full flex flex-col bg-white shadow-md">
        <CardContent className="overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-purple-700 sticky top-0 bg-white z-10 pb-2">
            Test Your Knowledge
          </h2>
          
          {isGeneratingMcqs ? (
            <div className="flex items-center gap-3 p-8 text-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
              <span className="text-gray-600">MCQs are getting generated...</span>
            </div>
          ) : currentMcqs && currentMcqs.length > 0 ? (
            <>
              {showResults && (
                <div className={`p-4 mb-4 rounded-md ${
                  score === currentMcqs.length 
                    ? 'bg-green-100 text-green-800' 
                    : score >= currentMcqs.length / 2 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-red-100 text-red-800'
                }`}>
                  <p className="font-medium">
                    You scored {score} out of {currentMcqs.length}
                    {score === currentMcqs.length ? ' - Perfect!' : ''}
                  </p>
                </div>
              )}
              
              <div className="space-y-6">
                {currentMcqs.map((question, questionIndex) => (
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
              
              <div className="mt-6 flex gap-4 sticky bottom-0 bg-white pt-4">
                {showResults ? (
                  <Button onClick={resetAnswers} className="w-full">Try Again</Button>
                ) : (
                  <Button 
                    onClick={checkAnswers} 
                    disabled={Object.keys(selectedAnswers).length !== currentMcqs.length}
                    className="w-full"
                  >
                    Check Answers
                  </Button>
                )}
              </div>
            </>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                <AlertCircle size={20} />
                <span className="font-medium">MCQ Generation Failed</span>
              </div>
              <p className="text-gray-600 text-sm">
                Unable to generate questions from this content. Please try again.
              </p>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No questions could be generated from this content.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MCQDisplay;