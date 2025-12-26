
import React, { useState } from 'react';
import { BookOpen, BrainCircuit, LineChart, Zap, GraduationCap, Search, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  onAction: (view: any, topic?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Biology' | 'Physics' | 'Chemistry'>('All');

  const syllabus = [
    { 
      name: 'Biology', 
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      accent: 'bg-emerald-500',
      units: [
        { name: 'Diversity in Living World', topics: ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom'] },
        { name: 'Structural Organisation', topics: ['Morphology of Flowering Plants', 'Anatomy of Flowering Plants', 'Structural Organisation in Animals'] },
        { name: 'Cell Structure & Function', topics: ['Cell: The Unit of Life', 'Biomolecules', 'Cell Cycle and Cell Division'] },
        { name: 'Plant Physiology', topics: ['Transport in Plants', 'Mineral Nutrition', 'Photosynthesis in Higher Plants', 'Respiration in Plants', 'Plant Growth and Development'] },
        { name: 'Human Physiology', topics: ['Digestion and Absorption', 'Breathing and Exchange of Gases', 'Body Fluids and Circulation', 'Excretory Products and their Elimination', 'Locomotion and Movement', 'Neural Control and Coordination', 'Chemical Coordination and Integration'] },
        { name: 'Reproduction', topics: ['Reproduction in Organisms', 'Sexual Reproduction in Flowering Plants', 'Human Reproduction', 'Reproductive Health'] },
        { name: 'Genetics & Evolution', topics: ['Principles of Inheritance and Variation', 'Molecular Basis of Inheritance', 'Evolution'] },
        { name: 'Biology in Human Welfare', topics: ['Human Health and Disease', 'Strategies for Enhancement in Food Production', 'Microbes in Human Welfare'] },
        { name: 'Biotechnology', topics: ['Biotechnology: Principles and Processes', 'Biotechnology and its Applications'] },
        { name: 'Ecology & Environment', topics: ['Organisms and Populations', 'Ecosystem', 'Biodiversity and Conservation', 'Environmental Issues'] }
      ]
    },
    { 
      name: 'Physics', 
      color: 'bg-sky-50 text-sky-700 border-sky-100',
      accent: 'bg-sky-500',
      units: [
        { name: 'Mechanics', topics: ['Physical World & Measurement', 'Units and Measurements', 'Motion in a Straight Line', 'Motion in a Plane', 'Laws of Motion', 'Work, Energy and Power', 'System of Particles and Rotational Motion', 'Gravitation'] },
        { name: 'Properties of Matter', topics: ['Mechanical Properties of Solids', 'Mechanical Properties of Fluids', 'Thermal Properties of Matter'] },
        { name: 'Thermodynamics & KTG', topics: ['Thermodynamics', 'Kinetic Theory'] },
        { name: 'Oscillations & Waves', topics: ['Oscillations', 'Waves'] },
        { name: 'Electrostatics', topics: ['Electric Charges and Fields', 'Electrostatic Potential and Capacitance'] },
        { name: 'Electrodynamics', topics: ['Current Electricity', 'Moving Charges and Magnetism', 'Magnetism and Matter', 'Electromagnetic Induction', 'Alternating Current', 'Electromagnetic Waves'] },
        { name: 'Optics', topics: ['Ray Optics and Optical Instruments', 'Wave Optics'] },
        { name: 'Modern Physics', topics: ['Dual Nature of Radiation and Matter', 'Atoms', 'Nuclei', 'Semiconductor Electronics'] }
      ]
    },
    { 
      name: 'Chemistry', 
      color: 'bg-violet-50 text-violet-700 border-violet-100',
      accent: 'bg-violet-500',
      units: [
        { name: 'Physical Chemistry', topics: ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements and Periodicity', 'Chemical Bonding and Molecular Structure', 'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry'] },
        { name: 'Inorganic Chemistry', topics: ['General Principles and Processes of Isolation', 'Hydrogen', 'The s-Block Elements', 'The p-Block Elements', 'The d and f Block Elements', 'Coordination Compounds'] },
        { name: 'Organic Chemistry', topics: ['Organic Chemistry: Basic Principles', 'Hydrocarbons', 'Environmental Chemistry', 'Haloalkanes and Haloarenes', 'Alcohols, Phenols and Ethers', 'Aldehydes, Ketones and Carboxylic Acids', 'Amines', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life'] }
      ]
    }
  ];

  const filteredSyllabus = syllabus
    .filter(sub => activeFilter === 'All' || sub.name === activeFilter)
    .map(sub => ({
      ...sub,
      units: sub.units.map(unit => ({
        ...unit,
        topics: unit.topics.filter(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      })).filter(unit => unit.topics.length > 0)
    })).filter(sub => sub.units.length > 0);

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-amber-500/30">
            <Zap size={14} fill="currentColor" /> AIIMS-LEVEL PREP ACTIVE
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1]">
            Cracking NEET <span className="text-amber-500">Requires Depth.</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed font-medium">
            Exhaustive NCERT coverage with AI-generated high-difficulty assessments. Every footnote, every diagram, every exception.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onAction('quiz', 'Principles of Inheritance and Variation')}
              className="bg-amber-500 hover:bg-amber-600 px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-amber-500/20 flex items-center gap-3 text-lg group"
            >
              <BrainCircuit size={24} className="group-hover:rotate-12 transition-transform" /> Start Hard Mock Test
            </button>
            <button 
              onClick={() => onAction('analytics')}
              className="bg-slate-800 hover:bg-slate-700 px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 border border-slate-700"
            >
              <LineChart size={24} /> Performance
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 opacity-10 select-none pointer-events-none transform rotate-12">
          <GraduationCap size={480} />
        </div>
      </div>

      {/* Syllabus Explorer */}
      <section className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-20 z-40">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">NTA NEET-UG Syllabus</h3>
              <p className="text-slate-500 text-sm font-medium">97 Chapters • Class 11 & 12</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
            <div className="relative group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Find a chapter (e.g. 'Thermodynamics')..." 
                className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none w-full transition-all text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex p-1.5 bg-slate-100 rounded-2xl shrink-0">
              {['All', 'Biology', 'Physics', 'Chemistry'].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === f ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {filteredSyllabus.map((sub) => (
            <div key={sub.name} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-1.5 h-8 rounded-full ${sub.accent}`}></div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight">{sub.name} Modules</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sub.units.map((unit) => (
                  <div key={unit.name} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group flex flex-col">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50">
                      <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                        {unit.name}
                      </h5>
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold">
                        {unit.topics.length} {unit.topics.length === 1 ? 'Chapter' : 'Chapters'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 flex-1">
                      {unit.topics.map((topic) => (
                        <button 
                          key={topic} 
                          onClick={() => onAction('notes', topic)}
                          className={`px-4 py-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-amber-400 hover:text-amber-700 hover:shadow-lg hover:shadow-amber-500/10 transition-all text-sm font-bold flex items-center gap-2 group/btn`}
                        >
                          <CheckCircle2 size={14} className="text-slate-300 group-hover/btn:text-amber-500 transition-colors" />
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {filteredSyllabus.length === 0 && (
        <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto mb-4">
            <Search size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-bold text-lg">No chapters matching "{searchQuery}"</p>
          <button 
            onClick={() => {setSearchQuery(''); setActiveFilter('All');}} 
            className="text-amber-600 font-bold mt-4 hover:underline text-sm"
          >
            Clear all filters and search again
          </button>
        </div>
      )}
    </div>
  );
};
