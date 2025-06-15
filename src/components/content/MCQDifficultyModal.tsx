import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Zap, Target, Trophy } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface MCQDifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
}

const difficultyLevels = [
  {
    value: 'easy' as DifficultyLevel,
    label: 'Easy',
    description: 'Basic questions with straightforward answers',
    emoji: '🌱',
    icon: Brain,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-700',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-500'
  },
  {
    value: 'medium' as DifficultyLevel,
    label: 'Medium',
    description: 'Moderate questions requiring deeper understanding',
    emoji: '🚀',
    icon: Zap,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-700',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-cyan-500'
  },
  {
    value: 'hard' as DifficultyLevel,
    label: 'Hard',
    description: 'Challenging questions for advanced learners',
    emoji: '🏆',
    icon: Trophy,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-700',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-pink-500'
  }
];

const MCQDifficultyModal: React.FC<MCQDifficultyModalProps> = ({
  isOpen,
  onClose,
  onSelectDifficulty,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);

  const handleGenerateQuiz = () => {
    if (selectedDifficulty) {
      onSelectDifficulty(selectedDifficulty);
      onClose();
      // Reset selection for next time
      setSelectedDifficulty(null);
    }
  };

  const handleCloseModal = () => {
    onClose();
    // Reset selection when modal is closed
    setSelectedDifficulty(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[9999]"
          >
            <Card className="bg-white dark:bg-gray-800 shadow-2xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Choose Quiz Difficulty
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Select the difficulty level for your quiz questions
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X size={20} />
                  </Button>
                </div>
                
                {/* Difficulty Level Selection */}
                <div className="space-y-4 mb-6">
                  {difficultyLevels.map((level, index) => {
                    const IconComponent = level.icon;
                    
                    return (
                      <motion.div
                        key={level.value}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <label
                          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedDifficulty === level.value
                              ? `${level.borderColor} ${level.bgColor} shadow-md`
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="difficulty"
                            value={level.value}
                            checked={selectedDifficulty === level.value}
                            onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{level.emoji}</span>
                              <div className={`p-2 rounded-lg ${level.bgColor} border ${level.borderColor}`}>
                                <IconComponent className={`h-5 w-5 ${level.color}`} />
                              </div>
                              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                                {level.label}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-8">
                              {level.description}
                            </p>
                          </div>
                        </label>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Generate Button */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateQuiz}
                    disabled={!selectedDifficulty}
                    variant="sketchy"
                    className={`flex-1 ${
                      selectedDifficulty 
                        ? `bg-gradient-to-r ${difficultyLevels.find(l => l.value === selectedDifficulty)?.gradientFrom} ${difficultyLevels.find(l => l.value === selectedDifficulty)?.gradientTo} hover:opacity-90 text-white border-none shadow-lg`
                        : ''
                    }`}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Generate Quiz
                  </Button>
                </div>

                {/* Info */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    The quiz will be tailored to your selected difficulty level
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MCQDifficultyModal;