
import React, { useState, useEffect } from 'react';
import { ChevronLeft, BarChart3, TrendingUp, Target, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { QuizResult, RemedialPlan } from '../types.ts';
import { getRemedialPlan } from '../services/geminiService.ts';

interface AnalyticsViewProps {
  onBack: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onBack }) => {
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [remedialPlan, setRemedialPlan] = useState<RemedialPlan | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    setHistory(saved);
  }, []);

  const generatePlan = async () => {
    if (history.length === 0) return;
    setLoadingPlan(true);
    try {
      const lastResult = history[history.length - 1];
      const data = await getRemedialPlan(lastResult);
      setRemedialPlan(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlan(false);
    }
  };

  const avgAccuracy = history.length > 0 
    ? Math.round((history.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / history.length) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Scholar Performance</h2>
          <p className="text-slate-500 font-medium">Tracking your path to AIIMS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Target size={20} /></div>
            <h4 className="font-bold text-slate-800">Mock Tests</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">{history.length}</p>
          <p className="text-xs text-slate-400 font-medium mt-1">Completed modules</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
            <h4 className="font-bold text-slate-800">Avg Accuracy</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">{avgAccuracy}%</p>
          <p className="text-xs text-slate-400 font-medium mt-1">Overall precision</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><BarChart3 size={20} /></div>
            <h4 className="font-bold text-slate-800">Potential Rank</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">~12.5k</p>
          <p className="text-xs text-slate-400 font-medium mt-1">Estimated AIR</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Recent Test History</h3>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-slate-400 italic">No tests taken yet. Start learning!</p>
            ) : (
              [...history].reverse().map((res, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <h5 className="font-bold text-slate-800">{res.topic}</h5>
                    <span className="text-xs text-slate-400 font-medium">{new Date(res.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${res.score >= (res.total * 0.5) ? 'text-green-600' : 'text-red-600'}`}>
                      {res.score}/{res.total}
                    </p>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                      {Math.round((res.score / res.total) * 100)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ZapIcon className="text-amber-400" /> AI Remedial Plan
            </h3>
            
            {!remedialPlan ? (
              <div className="space-y-4">
                <p className="text-slate-400 leading-relaxed">
                  Based on your missed questions, the AI will generate a specific 2-day recovery plan to patch your "weak links."
                </p>
                <button 
                  onClick={generatePlan}
                  disabled={loadingPlan || history.length === 0}
                  className="bg-amber-500 hover:bg-amber-600 px-6 py-2 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {loadingPlan ? <Loader2 className="animate-spin" size={18} /> : 'Generate My Weak-Link Fix'}
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-2 text-amber-400 mb-2 font-bold text-sm">
                    <AlertCircle size={16} /> Strategy
                  </div>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{remedialPlan.plan}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 mb-2 font-bold text-sm">
                    <BookOpen size={16} /> Simplified Key Points
                  </div>
                  {remedialPlan.simplifiedNotes.map((note, i) => (
                    <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-lg text-xs leading-relaxed">
                      {note}
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setRemedialPlan(null)}
                  className="text-xs text-slate-500 hover:text-white underline"
                >
                  Regenerate for next topic
                </button>
              </div>
            )}
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <ZapIcon size={200} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ZapIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
