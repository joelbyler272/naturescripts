'use client';

import { useState } from 'react';
import { QUIZZES, Quiz, QuizResult } from '@/lib/quizzes/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Brain, Moon, Leaf, ArrowLeft, ArrowRight,
  CheckCircle, Sparkles, RotateCcw
} from 'lucide-react';

const QUIZ_ICONS: Record<string, React.ReactNode> = {
  brain: <Brain className="w-6 h-6" />,
  moon: <Moon className="w-6 h-6" />,
  leaf: <Leaf className="w-6 h-6" />,
};

export function QuizzesContent() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  const handleAnswer = (questionId: string, points: number) => {
    const newAnswers = { ...answers, [questionId]: points };
    setAnswers(newAnswers);

    if (selectedQuiz && currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else if (selectedQuiz) {
      // Calculate result
      const totalScore = Object.values(newAnswers).reduce((sum, p) => sum + p, 0);
      const maxScore = selectedQuiz.questions.length * 4;
      setResult(selectedQuiz.getResult(totalScore, maxScore));
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
    }
  };

  const handleReset = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  // Quiz Selection Screen
  if (!selectedQuiz) {
    return (
      <div className="max-w-2xl mx-auto py-6 sm:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Health Quizzes</h1>
          <p className="text-sm text-muted-foreground">
            Quick assessments to understand your wellness and get personalized remedy suggestions.
          </p>
        </div>

        <div className="space-y-3">
          {QUIZZES.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => handleStartQuiz(quiz)}
              className="w-full flex items-start gap-4 p-4 bg-white border border-border/40 rounded-xl hover:border-accent/40 transition-colors text-left group"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
                {QUIZ_ICONS[quiz.icon] || <Sparkles className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                  {quiz.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{quiz.description}</p>
                <p className="text-xs text-accent mt-1">{quiz.questions.length} questions</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground mt-1 group-hover:text-accent transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Result Screen
  if (result) {
    return (
      <div className="max-w-2xl mx-auto py-6 sm:py-10">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          All Quizzes
        </button>

        <div className="bg-white border border-border/40 rounded-xl p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-accent">
              {QUIZ_ICONS[selectedQuiz.icon]}
            </div>
            <h2 className="text-xl font-semibold text-foreground">{result.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Score: {result.score} / {result.maxScore}
            </p>
          </div>

          <p className="text-sm text-foreground leading-relaxed mb-6">{result.description}</p>

          <div>
            <h3 className="text-sm font-medium text-accent uppercase tracking-wide mb-3">Suggestions</h3>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleStartQuiz(selectedQuiz)} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </Button>
          <Button variant="outline" onClick={handleReset}>
            All Quizzes
          </Button>
        </div>
      </div>
    );
  }

  // Question Screen
  const question = selectedQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10">
      <button
        onClick={handleReset}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        All Quizzes
      </button>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-foreground">{selectedQuiz.title}</h2>
          <span className="text-xs text-muted-foreground">
            {currentQuestion + 1} of {selectedQuiz.questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-1.5 bg-secondary [&>div]:bg-accent" />
      </div>

      <div className="bg-white border border-border/40 rounded-xl p-5 sm:p-6">
        <h3 className="text-base font-medium text-foreground mb-4">{question.question}</h3>

        <div className="space-y-2">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(question.id, option.points)}
              className={cn(
                'w-full px-4 py-3 text-sm text-left rounded-lg border transition-colors',
                answers[question.id] === option.points
                  ? 'bg-accent/10 text-accent border-accent/40 font-medium'
                  : 'bg-white text-muted-foreground border-border hover:border-accent/30 hover:text-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {currentQuestion > 0 && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
        </div>
      )}
    </div>
  );
}
