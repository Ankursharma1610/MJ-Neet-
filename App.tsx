
import React, { useState } from 'react';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './views/Dashboard.tsx';
import { NotesView } from './views/NotesView.tsx';
import { QuizView } from './views/QuizView.tsx';
import { AnalyticsView } from './views/AnalyticsView.tsx';

type View = 'dashboard' | 'notes' | 'quiz' | 'analytics';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<string>('Human Reproduction');

  const navigateToView = (view: View, topic?: string) => {
    if (topic) setSelectedTopic(topic);
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onAction={navigateToView} />;
      case 'notes':
        return <NotesView topic={selectedTopic} onBack={() => setCurrentView('dashboard')} />;
      case 'quiz':
        return <QuizView topic={selectedTopic} onFinish={() => setCurrentView('analytics')} onBack={() => setCurrentView('dashboard')} />;
      case 'analytics':
        return <AnalyticsView onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onAction={navigateToView} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
