import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle, Trophy, Star, ChevronLeft, ChevronRight, RefreshCw, Brain, Target, Zap } from 'lucide-react';
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
      return { message: "Perfect! Outstanding work! 🎉", color: "text-green-600 dark:text-green-400", bgColor: "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30" };
    } else if (percentage >= 80) {
      return { message: "Great job! Well done! 👏", color: "text-green-600 dark:text-green-400", bgColor: "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30" };
    } else if (percentage >= 60) {
      return { message: "Good effort! Keep it up! 👍", color: "text-blue-600 dark:text-blue-400", bgColor: "from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30" };
    } else if (percentage >= 40) {
      return { message: "Nice try! You're getting there! 💪", color: "text-orange-600 dark:text-orange-400", bgColor: "from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30" };
    } else {
      return { message: "Keep practicing! You'll improve! 🌟", color: "text-purple-600 dark:text-purple-400", bgColor: "from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30" };
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
      <Card className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 shadow-2xl border-2 border-blue-200/50 dark:border-blue-700/50">
        <CardContent className="p-6">
          {/* Header with title and progress side by side */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-blue-700 dark:from-blue-300 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
                Test Your Knowledge
              </h2>
            </div>
            
            {/* Progress indicator - only show when we have MCQs and not in loading/error states */}
            {currentMcqs && currentMcqs.length > 0 && !isGeneratingMcqs && mcqGenerationStatus !== 'generating' && (
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  {reviewMode ? `Review ${reviewQuestionIndex + 1}/${currentMcqs.length}` : `Question ${currentQuestionIndex + 1}/${currentMcqs.length}`}
                </span>
                <div className="flex space-x-2">
                  {currentMcqs.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index <= (reviewMode ? reviewQuestionIndex : currentQuestionIndex)
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      animate={{
                        scale: index === (reviewMode ? reviewQuestionIndex : currentQuestionIndex) ? 1.2 : 1
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {mcqGenerationStatus === 'generating' || isGeneratingMcqs ? (
            <motion.div 
              className="flex items-center gap-4 p-12 text-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-blue-200 dark:border-blue-700"
              animate={{ 
                background: [
                  "linear-gradient(45deg, rgb(219 234 254), rgb(243 232 255))",
                  "linear-gradient(45deg, rgb(243 232 255), rgb(219 234 254))"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <span className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                Crafting brain-teasing questions...
              </span>
            </motion.div>
          ) : mcqGenerationStatus === 'failed_first_attempt' ? (
            <motion.div 
              className="p-8 text-center bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-2xl border-2 border-orange-200 dark:border-orange-700"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center justify-center gap-3 text-orange-600 dark:text-orange-400 mb-4">
                <AlertCircle size={24} />
                <span className="text-xl font-semibold">MCQ Generation Failed</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-base mb-6 leading-relaxed">
                {mcqErrorMessage}
              </p>
              <Button
                onClick={retryMcqGeneration}
                variant="sketchy"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-none shadow-lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry MCQ Generation
              </Button>
            </motion.div>
          ) : mcqGenerationStatus === 'failed_second_attempt' ? (
            <motion.div 
              className="p-8 text-center bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-red-200 dark:border-red-700"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center justify-center gap-3 text-red-600 dark:text-red-400 mb-2">
                <AlertCircle size={24} />
                <span className="text-xl font-semibold">MCQ Generation Failed</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                {mcqErrorMessage}
              </p>
            </motion.div>
          ) : currentMcqs && currentMcqs.length > 0 ? (
            <>
              {reviewMode ? (
                // Review Mode
                <div className="space-y-8">
                  {/* Review Question */}
                  <motion.div
                    key={reviewQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Enhanced Question Display */}
                    <motion.div 
                      className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-700 shadow-xl"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                          {currentMcqs[reviewQuestionIndex].question}
                        </h3>
                      </div>
                    </motion.div>
                    
                    <div className="space-y-4">
                      {currentMcqs[reviewQuestionIndex].options.map((option, optionIndex) => {
                        const isUserAnswer = selectedAnswers[reviewQuestionIndex] === optionIndex;
                        const isCorrectAnswer = currentMcqs[reviewQuestionIndex].correctAnswer === optionIndex;
                        const isWrongUserAnswer = isUserAnswer && !isCorrectAnswer;
                        
                        let optionClass = 'border-2 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl';
                        let iconColor = 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700';
                        let icon = String.fromCharCode(65 + optionIndex);
                        let bgGradient = 'bg-white dark:bg-gray-800';
                        
                        if (isCorrectAnswer) {
                          optionClass += ' border-green-500 shadow-green-200 dark:shadow-green-900/50';
                          iconColor = 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg';
                          icon = '✓';
                          bgGradient = 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30';
                        } else if (isWrongUserAnswer) {
                          optionClass += ' border-red-500 shadow-red-200 dark:shadow-red-900/50';
                          iconColor = 'border-red-500 bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg';
                          icon = '✗';
                          bgGradient = 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30';
                        } else {
                          optionClass += ' border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500';
                        }
                        
                        return (
                          <motion.div 
                            key={optionIndex} 
                            className={`${optionClass} ${bgGradient}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: optionIndex * 0.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                          >
                            <div className="flex items-start gap-4">
                              <span className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-200 ${iconColor}`}>
                                {icon}
                              </span>
                              <div className="flex-1">
                                <span className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-medium">{option}</span>
                                {isCorrectAnswer && (
                                  <motion.div 
                                    className="text-sm text-green-600 dark:text-green-400 font-bold mt-3 flex items-center gap-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Correct Answer
                                  </motion.div>
                                )}
                                {isWrongUserAnswer && (
                                  <motion.div 
                                    className="text-sm text-red-600 dark:text-red-400 font-bold mt-3 flex items-center gap-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                  >
                                    <AlertCircle className="h-4 w-4" />
                                    Your Answer (Incorrect)
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    {/* Enhanced Explanation for wrong answers */}
                    {selectedAnswers[reviewQuestionIndex] !== currentMcqs[reviewQuestionIndex].correctAnswer && (
                      <motion.div 
                        className="mt-8 p-6 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-2xl shadow-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-blue-800 dark:text-blue-300 font-semibold mb-2">
                              💡 Learning Moment
                            </p>
                            <p className="text-blue-700 dark:text-blue-300">
                              <strong>Correct Answer:</strong> {currentMcqs[reviewQuestionIndex].options[currentMcqs[reviewQuestionIndex].correctAnswer]}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {/* Review Navigation */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleReviewPrevious}
                      disabled={reviewQuestionIndex === 0}
                      variant="sketchy"
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-none shadow-lg disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    
                    {reviewQuestionIndex === currentMcqs.length - 1 ? (
                      <Button
                        onClick={backToResults}
                        variant="sketchy"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none shadow-lg"
                      >
                        Results
                      </Button>
                    ) : (
                      <Button
                        onClick={handleReviewNext}
                        variant="sketchy"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none shadow-lg"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : quizCompleted ? (
                // Completion Screen
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`text-center py-12 bg-gradient-to-br ${scoreMessage.bgColor} rounded-2xl border-2 border-purple-200 dark:border-purple-700 shadow-2xl`}
                >
                  {/* Animated Trophy Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-8"
                  >
                    <div className="relative inline-block">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl"
                      >
                        <Trophy className="h-16 w-16 text-white" />
                      </motion.div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-2 -right-2"
                      >
                        <div className="p-2 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg">
                          <Star className="h-6 w-6 text-white" />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Score Display */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                  >
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                      Quiz Completed! 🎉
                    </h3>
                    <motion.div 
                      className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {score}/{currentMcqs.length}
                    </motion.div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                      You answered {score} out of {currentMcqs.length} questions correctly
                    </p>
                  </motion.div>
                  
                  {/* Score Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-10"
                  >
                    <p className={`text-2xl font-bold ${scoreMessage.color}`}>
                      {scoreMessage.message}
                    </p>
                  </motion.div>
                  
                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-4"
                  >
                    <Button 
                      onClick={startReview} 
                      variant="sketchy" 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none shadow-lg text-lg py-3"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      Review Answers
                    </Button>
                    <Button 
                      onClick={resetQuiz} 
                      variant="sketchy" 
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-none shadow-lg text-lg py-3"
                    >
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Try Again
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                // Single Question Display
                <>
                  {/* Progress Bar */}
                  <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 shadow-inner border border-gray-300 dark:border-gray-600">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-4 rounded-full shadow-lg"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${((currentQuestionIndex + 1) / currentMcqs.length) * 100}%` 
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Current Question */}
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Enhanced Question Display */}
                    <motion.div 
                      className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-700 shadow-xl"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                          {currentMcqs[currentQuestionIndex].question}
                        </h3>
                      </div>
                    </motion.div>
                    
                    <div className="space-y-4">
                      {currentMcqs[currentQuestionIndex].options.map((option, optionIndex) => {
                        const isSelected = selectedAnswers[currentQuestionIndex] === optionIndex;
                        
                        return (
                          <motion.div
                            key={optionIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: optionIndex * 0.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl ${
                              isSelected 
                                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 shadow-purple-200 dark:shadow-purple-900/50 scale-[1.02]' 
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:border-purple-400 dark:hover:border-purple-500'
                            }`}
                            onClick={() => handleOptionSelect(optionIndex)}
                          >
                            <div className="flex items-start gap-4">
                              <motion.span 
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-all duration-200 ${
                                  isSelected 
                                    ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg' 
                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}
                                animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                {String.fromCharCode(65 + optionIndex)}
                              </motion.span>
                              <span className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed flex-1 font-medium">
                                {option}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                  
                  {/* Submit Button - Only show on last question and when answered */}
                  {currentQuestionIndex === currentMcqs.length - 1 && selectedAnswers[currentQuestionIndex] !== undefined && (
                    <motion.div 
                      className="mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button 
                        onClick={handleSubmit}
                        variant="sketchy"
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-none shadow-lg text-lg py-4"
                      >
                        <Trophy className="h-5 w-5 mr-2" />
                        Submit Quiz
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </>
          ) : error ? (
            <motion.div 
              className="p-8 text-center bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-red-200 dark:border-red-700"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center justify-center gap-3 text-red-600 dark:text-red-400 mb-4">
                <AlertCircle size={24} />
                <span className="text-xl font-semibold">MCQ Generation Failed</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                Unable to generate questions from this content. Please try again.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-lg">No questions could be generated from this content.</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MCQDisplay;