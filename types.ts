
export enum Subject {
  BIOLOGY = 'Biology',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry'
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  ncertReference: string;
  type: 'standard' | 'assertion-reason' | 'statement-based' | 'match-following';
}

export interface NoteModule {
  topic: string;
  conceptOverview: string;
  deepDiveMechanism?: string;
  keyNcertLines: string[];
  confusedTerms: { term1: string; term2: string; difference: string }[];
  mnemonics: string[];
  examTraps?: string[];
  criticalData?: { label: string; value: string }[];
}

export interface QuizResult {
  score: number;
  total: number;
  topic: string;
  missedTopics: string[];
  timestamp: number;
}

export interface RemedialPlan {
  plan: string;
  simplifiedNotes: string[];
}
