import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle, Trophy, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import useContentStore from '../../store/contentStore';

const MCQDisplay: React.FC = () => {
  const { currentMcqs, isGeneratingMcqs, error } = useContentStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);
  
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
    setReviewMode(false);
    setReviewQuestionIndex(0);
  };
  
  const startReview = () => {
    setReviewMode(true);
    setReviewQuestionIndex(0);
  };
  
  const backToResults = () => {
    setReviewMode(false);
  };
  
  const handleReviewPrevious = () => {
    if (reviewQuestionIndex > 0) {
      setReviewQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleReviewNext = () => {
    if (reviewQuestionIndex < currentMcqs.length - 1) {
      setReviewQuestionIndex(prev => prev + 1);
    }
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
      return { message: "Perfect! Outstanding work! 🎉", color: "text-green-600 dark:text-green-400" };
    } else if (percentage >= 80) {
      return { message: "Great job! Well done! 👏", color: "text-green-600 dark:text-green-400" };
    } else if (percentage >= 60) {
      return { message: "Good effort! Keep it up! 👍", color: "text-blue-600 dark:text-blue-400" };
    } else if (percentage >= 40) {
      return { message: "Nice try! You're getting there! 💪", color: "text-orange-600 dark:text-orange-400" };
    } else {
      return { message: "Keep practicing! You'll improve! 🌟", color: "text-purple-600 dark:text-purple-400" };
    }
  };
  
  const score = getScore();
  const scoreMessage = getScoreMessage(score, currentMcqs?.length || 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">
            Test Your Knowledge
          </h2>
          
          {isGeneratingMcqs ? (
            <div className="flex items-center gap-3 p-8 text-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600 dark:text-purple-400" />
              <span className="text-gray-600 dark:text-gray-300">MCQs are getting generated...</span>
            </div>
          ) : currentMcqs && currentMcqs.length > 0 ? (
            <>
              {reviewMode ? (
                // Review Mode
                <div className="space-y-6">
                  {/* Review Progress */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Review {reviewQuestionIndex + 1}/{currentMcqs.length}
                    </span>
                    <Button
                      onClick={backToResults}
                      variant="sketchy"
                      size="sm"
                    >
                      Back to Results
                    </Button>
                  </div>
                  
                  {/* Review Question */}
                  <motion.div
                    key={reviewQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-6"
                  >
                    <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                      {currentMcqs[reviewQuestionIndex].question}
                    </h3>
                    
                    <div className="space-y-3">
                      {currentMcqs[reviewQuestionIndex].options.map((option, optionIndex) => {
                        const isUserAnswer = selectedAnswers[reviewQuestionIndex] === optionIndex;
                        const isCorrectAnswer = currentMcqs[reviewQuestionIndex].correctAnswer === optionIndex;
                        const isWrongUserAnswer = isUserAnswer && !isCorrectAnswer;
                        
                        let optionClass = 'border rounded-md p-4 transition-all';
                        let iconColor = 'border-gray-300 dark:border-gray-600';
                        let icon = String.fromCharCode(65 + optionIndex);
                        
                        if (isCorrectAnswer) {
                          optionClass += ' border-green-500 bg-green-50 dark:bg-green-900/20';
                          iconColor = 'border-green-500 bg-green-500 text-white';
                          icon = '✓';
                        } else if (isWrongUserAnswer) {
                          optionClass += ' border-red-500 bg-red-50 dark:bg-red-900/20';
                          iconColor = 'border-red-500 bg-red-500 text-white';
                          icon = '✗';
                        } else {
                          optionClass += ' border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800';
                        }
                        
                        return (
                          <div key={optionIndex} className={optionClass}>
                            <div className="flex items-start">
                              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs mr-3 ${iconColor}`}>
                                {icon}
                              </span>
                              <div className="flex-1">
                                <span className="text-gray-700 dark:text-gray-300">{option}</span>
                                {isCorrectAnswer && (
                                  <div className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                                    ✓ Correct Answer
                                  </div>
                                )}
                                {isWrongUserAnswer && (
                                  <div className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
                                    ✗ Your Answer (Incorrect)
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Explanation for wrong answers */}
                    {selectedAnswers[reviewQuestionIndex] !== currentMcqs[reviewQuestionIndex].correctAnswer && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          <strong>Correct Answer:</strong> {currentMcqs[reviewQuestionIndex].options[currentMcqs[reviewQuestionIndex].correctAnswer]}
                        </p>
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Review Navigation */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleReviewPrevious}
                      disabled={reviewQuestionIndex === 0}
                      variant="sketchy"
                      className="flex-1"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleReviewNext}
                      disabled={reviewQuestionIndex === currentMcqs.length - 1}
                      variant="sketchy"
                      className="flex-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ) : quizCompleted ? (
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
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Quiz Completed!
                    </h3>
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {score}/{currentMcqs.length}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
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
                  
                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-3"
                  >
                    <Button onClick={startReview} variant="sketchy" className="w-full">
                      Review Answers
                    </Button>
                    <Button onClick={resetQuiz} variant="sketchy" className="w-full">
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
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        Question {currentQuestionIndex + 1}/{currentMcqs.length}
                      </span>
                      <div className="flex space-x-1">
                        {currentMcqs.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index <= currentQuestionIndex 
                                ? 'bg-purple-600 dark:bg-purple-400' 
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full transition-all duration-300"
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
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-6"
                  >
                    <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
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
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => handleOptionSelect(optionIndex)}
                          >
                            <div className="flex items-start">
                              <span className={`flex items-center justify-center w-6 h-6 rounded-full border text-xs mr-3 ${
                                isSelected 
                                  ? 'border-purple-500 bg-purple-500 text-white' 
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}>
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              <span className="text-gray-700 dark:text-gray-300">{option}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                  
                  {/* Navigation Buttons */}
                  <div className="mt-6 flex gap-4">
                    {currentQuestionIndex < currentMcqs.length - 1 ? (
                      <Button 
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        variant="sketchy"
                        className="w-full"
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSubmit}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        variant="sketchy"
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
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <AlertCircle size={20} />
                <span className="font-medium">MCQ Generation Failed</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Unable to generate questions from this content. Please try again.
              </p>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <p>No questions could be generated from this content.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MCQDisplay;