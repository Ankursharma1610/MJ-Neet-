
import React, { useState, useEffect } from 'react';
import { Loader2, Timer, AlertCircle, CheckCircle, XCircle, ChevronRight, HelpCircle, Zap, BookOpen } from 'lucide-react';
import { MCQ } from '../types.ts';
import { generateQuiz } from '../services/geminiService.ts';

interface QuizViewProps {
  topic: string;
  onFinish: () => void;
  onBack: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ topic, onFinish, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const data = await generateQuiz(topic, 5);
        setQuestions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [topic]);

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setUserAnswers({ ...userAnswers, [questions[currentIndex].id]: idx });
  };

  const handleNext = () => {
    if (!showExplanation) {
      setShowExplanation(true);
    } else if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans === undefined) unanswered++;
      else if (ans === q.correctAnswer) correct++;
      else wrong++;
    });

    const score = (correct * 4) - (wrong * 1);
    const maxScore = questions.length * 4;

    const result = {
      score,
      total: maxScore,
      topic,
      missedTopics: questions.filter(q => userAnswers[q.id] !== q.correctAnswer).map(q => q.question.substring(0, 50) + "..."),
      timestamp: Date.now()
    };
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    localStorage.setItem('quizHistory', JSON.stringify([...history, result]));

    return { score, maxScore, correct, wrong, unanswered };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <Loader2 className="animate-spin text-amber-500 w-16 h-16" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="text-amber-500 w-6 h-6 animate-pulse" fill="currentColor" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-800 font-bold text-xl mb-1">Constructing AIIMS-Level Assessment</p>
          <p className="text-slate-400 font-medium">Topic: {topic}</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const stats = calculateResults();
    return (
      <div className="max-w-2xl mx-auto py-10 space-y-8 text-center animate-in zoom-in-95 duration-500">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl">
          <div className="inline-block p-5 rounded-3xl bg-amber-500 text-white mb-6 shadow-xl shadow-amber-500/20">
            <Zap size={40} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">Mock Test Analysis</h2>
          <p className="text-slate-500 mb-10 font-medium italic">"{topic}" Difficulty: Extreme</p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-widest mb-2">NEET Score</span>
              <p className="text-4xl font-black text-amber-600">{stats.score}<span className="text-lg text-slate-300 ml-1">/{stats.maxScore}</span></p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-widest mb-2">Accuracy</span>
              <p className="text-4xl font-black text-blue-600">
                {stats.correct + stats.wrong === 0 ? 0 : Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)}%
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex flex-col items-center">
              <span className="text-xs text-green-500 font-bold block uppercase tracking-widest mb-2">Correct</span>
              <p className="text-3xl font-black text-green-600">{stats.correct}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex flex-col items-center">
              <span className="text-xs text-red-400 font-bold block uppercase tracking-widest mb-2">Negative</span>
              <p className="text-3xl font-black text-red-600">-{stats.wrong}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onFinish}
              className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-2xl font-bold shadow-lg transition-all"
            >
              Consult Performance AI
            </button>
            <button 
              onClick={onBack}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-10 py-4 rounded-2xl font-bold transition-all"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const selectedAnswer = userAnswers[q.id];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-300">
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="px-5 py-2 bg-amber-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-amber-500/20">QUESTION {currentIndex + 1} OF {questions.length}</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{q.type.replace('-', ' ')}</span>
            <span className="text-xs font-bold text-amber-600">AIIMS-HARD MODE</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-700 font-black text-sm pr-2">
          <Timer size={20} className="text-amber-500" />
          <span className="tabular-nums">NTA PATTERN</span>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl min-h-[500px] flex flex-col">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-800 leading-[1.4] mb-12">{q.question}</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {q.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = showExplanation && i === q.correctAnswer;
              const isWrong = showExplanation && isSelected && i !== q.correctAnswer;

              let variant = "border-slate-100 hover:border-amber-400 hover:bg-amber-50 group";
              if (isSelected && !showExplanation) variant = "border-amber-500 bg-amber-50 ring-4 ring-amber-500/10 scale-[1.02]";
              if (isCorrect) variant = "border-green-500 bg-green-50 ring-4 ring-green-500/10";
              if (isWrong) variant = "border-red-500 bg-red-50 ring-4 ring-red-500/10";

              return (
                <button
                  key={i}
                  disabled={showExplanation}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-start gap-5 ${variant}`}
                >
                  <span className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-lg shrink-0 transition-colors ${isSelected ? 'bg-amber-500 text-white border-amber-500' : 'text-slate-400 border-slate-200 group-hover:border-amber-300'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={`font-bold text-lg pt-1.5 ${isSelected ? 'text-amber-900' : 'text-slate-700'}`}>{option}</span>
                  {isCorrect && <CheckCircle className="ml-auto text-green-500 mt-1.5 shrink-0" size={28} />}
                  {isWrong && <XCircle className="ml-auto text-red-500 mt-1.5 shrink-0" size={28} />}
                </button>
              );
            })}
          </div>
        </div>

        {showExplanation && (
          <div className="mt-12 p-8 bg-slate-900 rounded-3xl border border-slate-800 animate-in slide-in-from-top-4 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-amber-400 font-black text-sm uppercase tracking-widest">
                <BookOpen size={20} /> NCERT Insights & AI Logic
              </div>
              <p className="text-base text-slate-300 leading-relaxed mb-8 font-medium italic">"{q.explanation}"</p>
              <div className="flex items-center justify-between border-t border-slate-800 pt-6">
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  NCERT REFERENCE: <span className="text-amber-500 ml-1">{q.ncertReference}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${selectedAnswer === q.correctAnswer ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {selectedAnswer === q.correctAnswer ? '+4 MARKS' : '-1 NEGATIVE'}
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 opacity-[0.03] scale-150 transform translate-x-1/4 -translate-y-1/4">
               <HelpCircle size={200} />
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-col items-end gap-4">
          {selectedAnswer !== undefined && !showExplanation && (
            <button
              onClick={() => setShowExplanation(true)}
              className="group flex items-center gap-2 px-6 py-3 bg-white border-2 border-amber-500 text-amber-600 font-black rounded-2xl hover:bg-amber-50 transition-all shadow-lg shadow-amber-500/5 animate-in slide-in-from-bottom-2"
            >
              <BookOpen size={20} className="group-hover:rotate-12 transition-transform" />
              Reveal Explanation & NCERT Reference
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={selectedAnswer === undefined}
            className={`px-12 py-4 rounded-2xl font-black text-lg flex items-center gap-3 transition-all ${
              selectedAnswer === undefined
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200' 
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95'
            } ${showExplanation ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/40' : ''}`}
          >
            {!showExplanation 
              ? (currentIndex === questions.length - 1 ? 'Check Final Verdict' : 'Check Verdict & Next') 
              : (currentIndex === questions.length - 1 ? 'Finalize Test' : 'Proceed to Next challenge')}
            <ChevronRight size={24} strokeWidth={3} className={showExplanation ? 'animate-bounce-x' : ''} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
};
