
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  Loader2, 
  Sparkles, 
  BookCheck, 
  AlertCircle, 
  HelpCircle, 
  LayoutDashboard, 
  ChevronDown, 
  Maximize2,
  Minimize2,
  Search,
  X,
  Zap,
  Microscope,
  Binary,
  ShieldAlert
} from 'lucide-react';
import { NoteModule } from '../types.ts';
import { generateNotes } from '../services/geminiService.ts';

interface NotesViewProps {
  topic: string;
  onBack: () => void;
}

type SectionType = 'overview' | 'mechanism' | 'ncert' | 'terms' | 'mnemonics' | 'traps' | 'data';

export const NotesView: React.FC<NotesViewProps> = ({ topic, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<NoteModule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState<Record<SectionType, boolean>>({
    overview: true,
    mechanism: true,
    ncert: false,
    terms: false,
    mnemonics: false,
    traps: true,
    data: true
  });

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const data = await generateNotes(topic);
        setNotes(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [topic]);

  const toggleSection = (section: SectionType) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleAll = (expand: boolean) => {
    setExpanded({
      overview: expand,
      mechanism: expand,
      ncert: expand,
      terms: expand,
      mnemonics: expand,
      traps: expand,
      data: expand
    });
  };

  const highlightText = (text: string | undefined, query: string) => {
    if (!text) return null;
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-200 text-amber-900 rounded-sm px-0.5">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const filteredContent = useMemo(() => {
    if (!notes) return null;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return notes;

    return {
      ...notes,
      keyNcertLines: notes.keyNcertLines.filter(line => line.toLowerCase().includes(query)),
      confusedTerms: notes.confusedTerms.filter(item => 
        item.term1.toLowerCase().includes(query) || 
        item.term2.toLowerCase().includes(query) || 
        item.difference.toLowerCase().includes(query)
      ),
      mnemonics: notes.mnemonics.filter(m => m.toLowerCase().includes(query)),
      examTraps: notes.examTraps?.filter(t => t.toLowerCase().includes(query)),
      criticalData: notes.criticalData?.filter(d => d.label.toLowerCase().includes(query) || d.value.toLowerCase().includes(query))
    };
  }, [notes, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <Loader2 className="animate-spin text-amber-500 w-12 h-12" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="text-amber-500 w-5 h-5" fill="currentColor" />
          </div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Consulting AIIMS-Grade Archives for {topic}...</p>
      </div>
    );
  }

  if (!notes || !filteredContent) return <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">Failed to load notes.</div>;

  const sections: { id: SectionType; label: string; icon: React.ElementType; color: string; bg: string; border: string; count: number }[] = [
    { id: 'overview', label: 'Conceptual Overview', icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', count: 0 },
    { id: 'mechanism', label: 'Mechanism Deep-Dive', icon: Microscope, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', count: 0 },
    { id: 'data', label: 'Critical Values & Constants', icon: Binary, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', count: filteredContent.criticalData?.length || 0 },
    { id: 'traps', label: 'Examiner Traps (Be Careful!)', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', count: filteredContent.examTraps?.length || 0 },
    { id: 'ncert', label: 'High-Yield NCERT Lines', icon: BookCheck, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', count: filteredContent.keyNcertLines.length },
    { id: 'terms', label: 'Confused Terms', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', count: filteredContent.confusedTerms.length },
    { id: 'mnemonics', label: 'Memory Aids', icon: HelpCircle, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', count: filteredContent.mnemonics.length },
  ];

  const renderSectionContent = (id: SectionType) => {
    switch (id) {
      case 'overview':
        return <div className="p-6 text-slate-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{highlightText(notes.conceptOverview, searchQuery)}</div>;
      case 'mechanism':
        return <div className="p-6 text-slate-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base bg-slate-50/50 italic border-l-4 border-indigo-200">{highlightText(notes.deepDiveMechanism, searchQuery)}</div>;
      case 'data':
        return (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredContent.criticalData?.map((d, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase">{highlightText(d.label, searchQuery)}</span>
                <span className="font-black text-emerald-700">{highlightText(d.value, searchQuery)}</span>
              </div>
            ))}
          </div>
        );
      case 'traps':
        return (
          <div className="p-6 space-y-3">
            {filteredContent.examTraps?.map((trap, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-rose-50/30 rounded-xl border border-rose-100 text-rose-900 font-medium">
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <p className="text-sm">{highlightText(trap, searchQuery)}</p>
              </div>
            ))}
          </div>
        );
      case 'ncert':
        return (
          <div className="p-6 space-y-4">
            {filteredContent.keyNcertLines.map((line, i) => (
              <div key={i} className="p-4 bg-white border border-amber-100 rounded-xl italic text-amber-900/80 shadow-sm relative">
                <span className="absolute -top-3 left-4 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">NCERT Verbatim</span>
                {highlightText(line, searchQuery)}
              </div>
            ))}
          </div>
        );
      case 'terms':
        return (
          <div className="p-6 space-y-4">
            {filteredContent.confusedTerms.map((item, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 bg-white border border-orange-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded uppercase">{highlightText(item.term1, searchQuery)}</span>
                  <span className="text-slate-400 font-bold">vs</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded uppercase">{highlightText(item.term2, searchQuery)}</span>
                </div>
                <p className="text-sm text-slate-600 pl-1 border-l-2 border-orange-200">{highlightText(item.difference, searchQuery)}</p>
              </div>
            ))}
          </div>
        );
      case 'mnemonics':
        return (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredContent.mnemonics.map((m, i) => (
              <div key={i} className="p-4 bg-violet-50/30 border border-violet-100 rounded-xl text-violet-900 font-bold text-sm">
                {highlightText(m, searchQuery)}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 hover:bg-white hover:shadow rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ChevronLeft />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{notes.topic}</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">NTA/AIIMS ELITE MODULE</p>
            </div>
          </div>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">
          <LayoutDashboard size={18} /> <span className="text-sm">Dashboard</span>
        </button>
      </div>

      <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search molecular details, constants, or traps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-medium"
          />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={18} /></button>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => toggleAll(true)} className="px-4 py-2 text-xs font-black text-slate-600 hover:text-amber-600 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 uppercase tracking-widest"><Maximize2 size={14} /> Expand</button>
          <button onClick={() => toggleAll(false)} className="px-4 py-2 text-xs font-black text-slate-600 hover:text-amber-600 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 uppercase tracking-widest"><Minimize2 size={14} /> Collapse</button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className={`rounded-[2rem] border transition-all duration-300 shadow-sm bg-white overflow-hidden ${expanded[section.id] ? section.border : 'border-slate-100'}`}>
            <button onClick={() => toggleSection(section.id)} className={`w-full flex items-center justify-between p-6 text-left transition-colors ${expanded[section.id] ? section.bg : 'hover:bg-slate-50'}`}>
              <div className="flex items-center gap-5">
                <div className={`p-3 rounded-2xl ${section.bg} ${section.color} shadow-inner`}><section.icon size={24} /></div>
                <div>
                  <span className={`text-xl font-black tracking-tight block ${expanded[section.id] ? section.color : 'text-slate-800'}`}>{section.label}</span>
                  {searchQuery && <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{section.count} Results found</span>}
                </div>
              </div>
              <ChevronDown size={24} className={`text-slate-300 transition-transform duration-300 ${expanded[section.id] ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-500 ease-in-out ${expanded[section.id] ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <div className="border-t border-slate-50">{renderSectionContent(section.id)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="font-black text-lg mb-2 flex items-center gap-2 text-amber-400"><Zap size={20} fill="currentColor" /> Pro-tip for AIIMS Rankers</h4>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium">Use the "Examiner Traps" section to identify patterns in how NTA words tricky Assertion-Reasoning questions. Mastering these nuances is what separates the top 500 from the rest.</p>
        </div>
        <Zap className="absolute right-[-20px] bottom-[-20px] text-white opacity-[0.03] rotate-12" size={200} />
      </div>
    </div>
  );
};
