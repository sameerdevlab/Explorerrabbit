import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle, Trophy, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import useContentStore from '../../store/contentStore';

const MCQDisplay: React.FC = () => {
  const { currentMcqs, isGeneratingMcqs, error } = useContentStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  console.log('🔍 MCQDisplay render:', { 
    currentMcqs, 
    isGeneratingMcqs, 
    mcqCount: currentMcqs?.length || 0,
    error 
  });
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < currentMcqs.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handleSubmit = () => {
    setQuizCompleted(true);
  };
  
  const resetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
  };
  
  const getScore = () => {
    if (!currentMcqs) return 0;
    
    let correct = 0;
    currentMcqs.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    return correct;
  };
  
  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    
    if (percentage === 100) {
      return { message: "Perfect! Outstanding work! 🎉", color: "text-green-600" };
    } else if (percentage >= 80) {
      return { message: "Great job! Well done! 👏", color: "text-green-600" };
    } else if (percentage >= 60) {
      return { message: "Good effort! Keep it up! 👍", color: "text-blue-600" };
    } else if (percentage >= 40) {
      return { message: "Nice try! You're getting there! 💪", color: "text-orange-600" };
    } else {
      return { message: "Keep practicing! You'll improve! 🌟", color: "text-purple-600" };
    }
  };
  
  const score = getScore();
  const scoreMessage = getScoreMessage(score, currentMcqs?.length || 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full h-full"
    >
      <Card className="h-full flex flex-col bg-white shadow-md">
        <CardContent className="flex-grow overflow-y-auto">
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
              {quizCompleted ? (
                // Completion Screen
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  {/* Animated Trophy Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-6"
                  >
                    <div className="relative inline-block">
                      <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-2 -right-2"
                      >
                        <Star className="h-6 w-6 text-yellow-400" />
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Score Display */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Quiz Completed!
                    </h3>
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {score}/{currentMcqs.length}
                    </div>
                    <p className="text-gray-600">
                      You answered {score} out of {currentMcqs.length} questions correctly
                    </p>
                  </motion.div>
                  
                  {/* Score Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                  >
                    <p className={`text-lg font-semibold ${scoreMessage.color}`}>
                      {scoreMessage.message}
                    </p>
                  </motion.div>
                  
                  {/* Try Again Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button onClick={resetQuiz} className="w-full">
                      Try Again
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                // Single Question Display
                <>
                  {/* Progress Indicator */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-purple-600">
                        Question {currentQuestionIndex + 1}/{currentMcqs.length}
                      </span>
                      <div className="flex space-x-1">
                        {currentMcqs.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index <= currentQuestionIndex 
                                ? 'bg-purple-600' 
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${((currentQuestionIndex + 1) / currentMcqs.length) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Current Question */}
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-200 rounded-md p-6"
                  >
                    <h3 className="text-lg font-medium mb-4 text-gray-800">
                      {currentMcqs[currentQuestionIndex].question}
                    </h3>
                    
                    <div className="space-y-3">
                      {currentMcqs[currentQuestionIndex].options.map((option, optionIndex) => {
                        const isSelected = selectedAnswers[currentQuestionIndex] === optionIndex;
                        
                        return (
                          <motion.div
                            key={optionIndex}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`border rounded-md p-4 cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => handleOptionSelect(optionIndex)}
                          >
                            <div className="flex items-start">
                              <span className={`flex items-center justify-center w-6 h-6 rounded-full border text-xs mr-3 ${
                                isSelected 
                                  ? 'border-purple-500 bg-purple-500 text-white' 
                                  : 'border-gray-300'
                              }`}>
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              <span className="text-gray-700">{option}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                  
                  {/* Navigation Buttons */}
                  <div className="mt-6 flex gap-4 sticky bottom-0 bg-white pt-4">
                    {currentQuestionIndex < currentMcqs.length - 1 ? (
                      <Button 
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        className="w-full"
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSubmit}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        className="w-full"
                      >
                        Submit Quiz
                      </Button>
                    )}
                  </div>
                </>
              )}
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