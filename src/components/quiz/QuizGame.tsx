'use client';

import { useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { submitQuizAnswer } from '@/actions/game';
import { IQuizQuestion } from '@/types';

interface QuizGameProps {
    questions: IQuizQuestion[];
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export default function QuizGame({ questions }: QuizGameProps) {
    const { user, isSignedIn } = useUser();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = questions[currentIndex];

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#14b8a6', '#34d399', '#6ee7b7'],
        });
    }, []);

    const handleAnswer = async (answerIndex: number) => {
        if (answerState !== 'unanswered' || isSubmitting || !isSignedIn) return;

        setIsSubmitting(true);
        setSelectedAnswer(answerIndex);

        const result = await submitQuizAnswer(user!.id, currentQuestion._id, answerIndex);

        if (result.success) {
            setCorrectAnswer(result.correctIndex ?? null);

            if (result.correct) {
                setAnswerState('correct');
                setScore(prev => prev + 1);
                const pointsEarned = currentQuestion.difficulty === 'hard' ? 50 :
                    currentQuestion.difficulty === 'medium' ? 30 : 10;
                setTotalPoints(prev => prev + pointsEarned);
                triggerConfetti();
            } else {
                setAnswerState('incorrect');
            }
        }

        setIsSubmitting(false);
    };

    const handleNext = () => {
        if (currentIndex + 1 >= questions.length) {
            setIsFinished(true);
        } else {
            setCurrentIndex(prev => prev + 1);
            setAnswerState('unanswered');
            setSelectedAnswer(null);
            setCorrectAnswer(null);
        }
    };

    // Not signed in state
    if (!isSignedIn) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-xl dark:bg-zinc-800">
                <div className="mb-4 text-5xl">🔒</div>
                <h2 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">
                    Connexion requise
                </h2>
                <p className="mb-6 text-center text-zinc-600 dark:text-zinc-400">
                    Connecte-toi pour jouer au quiz et gagner des points !
                </p>
                <Link
                    href="/sign-in"
                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3 font-semibold text-white transition-all hover:shadow-lg"
                >
                    Se connecter
                </Link>
            </div>
        );
    }

    // No questions available
    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-xl dark:bg-zinc-800">
                <div className="mb-4 text-5xl">📚</div>
                <h2 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">
                    Aucune question disponible
                </h2>
                <p className="text-center text-zinc-600 dark:text-zinc-400">
                    Reviens plus tard pour de nouvelles questions !
                </p>
            </div>
        );
    }

    // Finished state
    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-xl dark:bg-zinc-800">
                <div className="mb-6 text-6xl">
                    {score === questions.length ? '🏆' : score >= questions.length / 2 ? '🎉' : '💪'}
                </div>
                <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
                    Quiz terminé !
                </h2>
                <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
                    Tu as obtenu <span className="font-bold text-emerald-600">{score}/{questions.length}</span> bonnes réponses
                </p>
                <div className="mb-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-100 px-6 py-3 dark:from-amber-900/30 dark:to-yellow-900/30">
                    <span className="text-2xl">⭐</span>
                    <span className="text-xl font-bold text-amber-700 dark:text-amber-400">
                        +{totalPoints} points
                    </span>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/"
                        className="rounded-xl border border-zinc-200 px-6 py-3 font-medium text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                        Accueil
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
                    >
                        Rejouer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-800">
            {/* Progress */}
            <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-500 dark:text-zinc-400">
                        Question {currentIndex + 1}/{questions.length}
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Score : {score}
                    </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Difficulty Badge */}
            <div className="mb-4">
                <span className={`
                    inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold
                    ${currentQuestion.difficulty === 'easy'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : currentQuestion.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }
                `}>
                    {currentQuestion.difficulty === 'easy' ? '🟢 Facile' :
                        currentQuestion.difficulty === 'medium' ? '🟡 Moyen' : '🔴 Difficile'}
                </span>
            </div>

            {/* Question */}
            <h2 className="mb-8 text-xl font-bold text-zinc-900 dark:text-white">
                {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => {
                    let buttonClass = 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-700/50 dark:text-zinc-200 dark:hover:bg-zinc-700';

                    if (answerState !== 'unanswered') {
                        if (index === correctAnswer) {
                            buttonClass = 'border-emerald-500 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300';
                        } else if (index === selectedAnswer && answerState === 'incorrect') {
                            buttonClass = 'border-red-500 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
                        } else {
                            buttonClass = 'border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500';
                        }
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={answerState !== 'unanswered' || isSubmitting}
                            className={`
                                flex items-center gap-4 rounded-xl border-2 px-6 py-4 text-left font-medium transition-all
                                ${buttonClass}
                                ${answerState === 'unanswered' && !isSubmitting ? 'cursor-pointer' : 'cursor-default'}
                            `}
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm dark:bg-zinc-800">
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span>{option}</span>
                            {answerState !== 'unanswered' && index === correctAnswer && (
                                <span className="ml-auto text-xl">✓</span>
                            )}
                            {answerState === 'incorrect' && index === selectedAnswer && (
                                <span className="ml-auto text-xl">✗</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Feedback & Next Button */}
            {answerState !== 'unanswered' && (
                <div className="mt-6 flex items-center justify-between">
                    <p className={`font-semibold ${answerState === 'correct' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {answerState === 'correct' ? '🎉 Bonne réponse !' : '❌ Mauvaise réponse'}
                    </p>
                    <button
                        onClick={handleNext}
                        className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
                    >
                        {currentIndex + 1 >= questions.length ? 'Voir le résultat' : 'Question suivante →'}
                    </button>
                </div>
            )}
        </div>
    );
}
