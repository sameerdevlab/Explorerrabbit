import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle, Trophy, Star, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import useContentStore from '../../store/contentStore';

const MCQDisplay: React.FC = () => {
  const { 
    currentMcqs, 
    isGeneratingMcqs, 
    error, 
    mcqGenerationStatus, 
    mcqErrorMessage, 
    retryMcqGeneration 
  } = useContentStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);
  
  console.log('🔍 MCQDisplay render:', { 
    currentMcqs, 
    isGeneratingMcqs, 
    mcqCount: currentMcqs?.length || 0,
    error,
    mcqGenerationStatus,
    mcqErrorMessage
  });
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
    
    // Auto-advance to next question if not the last question
    if (currentQuestionIndex < currentMcqs.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 500); // Small delay to show selection before advancing
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
          {/* Header with title and progress side by side */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300">
              Test Your Knowledge
            </h2>
            
            {/* Progress indicator - only show when we have MCQs and not in loading/error states */}
            {currentMcqs && currentMcqs.length > 0 && !isGeneratingMcqs && mcqGenerationStatus !== 'generating' && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {reviewMode ? `Review ${reviewQuestionIndex + 1}/${currentMcqs.length}` : `Question ${currentQuestionIndex + 1}/${currentMcqs.length}`}
                </span>
                <div className="flex space-x-1">
                  {currentMcqs.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index <= (reviewMode ? reviewQuestionIndex : currentQuestionIndex)
                          ? 'bg-purple-600 dark:bg-purple-400' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {mcqGenerationStatus === 'generating' || isGeneratingMcqs ? (
            <div className="flex items-center gap-3 p-8 text-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600 dark:text-purple-400" />
              <span className="text-gray-600 dark:text-gray-300">MCQs are getting generated...</span>
            </div>
          ) : mcqGenerationStatus === 'failed_first_attempt' ? (
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 mb-4">
                <AlertCircle size={20} />
                <span className="font-medium">MCQ Generation Failed</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {mcqErrorMessage}
              </p>
              <Button
                onClick={retryMcqGeneration}
                variant="sketchy"
                className="w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry MCQ Generation
              </Button>
            </div>
          ) : mcqGenerationStatus === 'failed_second_attempt' ? (
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <AlertCircle size={20} />
                <span className="font-medium">MCQ Generation Failed</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {mcqErrorMessage}
              </p>
            </div>
          ) : currentMcqs && currentMcqs.length > 0 ? (
            <>
              {reviewMode ? (
                // Review Mode
                <div className="space-y-6">
                  {/* Review Navigation Button */}
                  <div className="flex justify-end">
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
                    className="space-y-6"
                  >
                    {/* Enhanced Question Display */}
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-700 shadow-sm">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
                        {currentMcqs[reviewQuestionIndex].question}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      {currentMcqs[reviewQuestionIndex].options.map((option, optionIndex) => {
                        const isUserAnswer = selectedAnswers[reviewQuestionIndex] === optionIndex;
                        const isCorrectAnswer = currentMcqs[reviewQuestionIndex].correctAnswer === optionIndex;
                        const isWrongUserAnswer = isUserAnswer && !isCorrectAnswer;
                        
                        let optionClass = 'border rounded-xl p-5 transition-all duration-200 shadow-sm';
                        let iconColor = 'border-gray-300 dark:border-gray-600';
                        let icon = String.fromCharCode(65 + optionIndex);
                        
                        if (isCorrectAnswer) {
                          optionClass += ' border-green-600 bg-green-100 dark:bg-green-900 shadow-md';
                          iconColor = 'border-green-600 bg-green-600 text-white shadow-sm';
                          icon = '✓';
                        } else if (isWrongUserAnswer) {
                          optionClass += ' border-red-600 bg-red-100 dark:bg-red-900 shadow-md';
                          iconColor = 'border-red-600 bg-red-600 text-white shadow-sm';
                          icon = '✗';
                        } else {
                          optionClass += ' border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800';
                        }
                        
                        return (
                          <div key={optionIndex} className={optionClass}>
                            <div className="flex items-start">
                              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold mr-4 ${iconColor}`}>
                                {icon}
                              </span>
                              <div className="flex-1">
                                <span className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{option}</span>
                                {isCorrectAnswer && (
                                  <div className="text-sm text-green-600 dark:text-green-400 font-semibold mt-2">
                                    ✓ Correct Answer
                                  </div>
                                )}
                                {isWrongUserAnswer && (
                                  <div className="text-sm text-red-600 dark:text-red-400 font-semibold mt-2">
                                    ✗ Your Answer (Incorrect)
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Enhanced Explanation for wrong answers */}
                    {selectedAnswers[reviewQuestionIndex] !== currentMcqs[reviewQuestionIndex].correctAnswer && (
                      <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-xl shadow-sm">
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
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
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
                    className="space-y-6"
                  >
                    {/* Enhanced Question Display */}
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-700 shadow-sm">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
                        {currentMcqs[currentQuestionIndex].question}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      {currentMcqs[currentQuestionIndex].options.map((option, optionIndex) => {
                        const isSelected = selectedAnswers[currentQuestionIndex] === optionIndex;
                        
                        return (
                          <motion.div
                            key={optionIndex}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                              isSelected 
                                ? 'border-purple-600 bg-purple-100 dark:bg-purple-900 shadow-md transform scale-[1.02]' 
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-purple-400 dark:hover:border-purple-500 shadow-sm hover:shadow-md'
                            }`}
                            onClick={() => handleOptionSelect(optionIndex)}
                          >
                            <div className="flex items-start">
                              <span className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-semibold mr-4 transition-all duration-200 ${
                                isSelected 
                                  ? 'border-purple-600 bg-purple-600 text-white shadow-sm' 
                                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                              }`}>
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              <span className="text-gray-700 dark:text-gray-300 text-base leading-relaxed flex-1">{option}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                  
                  {/* Submit Button - Only show on last question and when answered */}
                  {currentQuestionIndex === currentMcqs.length - 1 && selectedAnswers[currentQuestionIndex] !== undefined && (
                    <div className="mt-6">
                      <Button 
                        onClick={handleSubmit}
                        variant="sketchy"
                        className="w-full"
                      >
                        Submit Quiz
                      </Button>
                    </div>
                  )}
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