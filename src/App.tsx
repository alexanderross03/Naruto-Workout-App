import { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { WorkoutPage } from './pages/WorkoutPage';
import { MacroPage } from './pages/MacroPage';
import { useAuth } from './hooks/useAuth';

type Page = 'workout' | 'macros';

export default function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('workout');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-naruto-orange/20 to-naruto-blue/20 flex items-center justify-center">
        <div className="text-xl text-naruto-orange animate-pulse-glow">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-naruto-orange/20 to-naruto-blue/20 leaf-pattern flex items-center justify-center p-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-naruto-orange/20 to-naruto-blue/20 leaf-pattern py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {currentPage === 'workout' ? (
          <WorkoutPage onNavigateToMacros={() => setCurrentPage('macros')} />
        ) : (
          <MacroPage onNavigateToWorkout={() => setCurrentPage('workout')} />
        )}
      </div>
    </div>
  );
}