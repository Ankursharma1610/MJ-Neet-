
import React from 'react';
import { BookOpen, LayoutDashboard, BrainCircuit, GraduationCap, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notes', label: 'Study Notes', icon: BookOpen },
    { id: 'quiz', label: 'Mock Test', icon: BrainCircuit },
    { id: 'analytics', label: 'Performance', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
          <GraduationCap className="text-amber-400 w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight">NEET Scholar AI</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id 
                ? 'bg-amber-500 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold">Powered by NCERT</p>
          <div className="bg-slate-800 p-3 rounded text-xs text-slate-400">
            Strictly aligned with NTA NEET-UG Syllabus
          </div>
        </div>
      </aside>

      {/* Mobile Nav */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-amber-400 w-6 h-6" />
          <span className="font-bold">NEET Scholar AI</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg ${
              currentView === item.id ? 'text-amber-500' : 'text-slate-400'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
