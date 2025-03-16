import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handlePasswordReset = async () => {
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
      
      // Check for errors in both query params and hash
      const errorDescription = params.get('error_description') || hashParams.get('error_description');
      if (errorDescription) {
        setError(decodeURIComponent(errorDescription).replace(/\+/g, ' '));
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Check for recovery token in hash
      const type = hashParams.get('type');
      if (type === 'recovery') {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          if (data?.session) {
            setIsResetPassword(true);
            setMessage('Please enter your new password');
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (err) {
          console.error('Error handling password reset:', err);
          setError('Failed to process password reset. Please try again.');
        }
      }
    };

    handlePasswordReset();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage('Password reset link sent to your email!');
      } else if (isResetPassword) {
        const { error } = await supabase.auth.updateUser({
          password: password
        });
        if (error) throw error;
        setMessage('Password updated successfully! You can now sign in with your new password.');
        setIsResetPassword(false);
        // Sign out after password reset to ensure clean state
        await supabase.auth.signOut();
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsForgotPassword(false);
    setIsResetPassword(false);
    setError('');
    setMessage('');
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/90 p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-naruto-orange/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-naruto-orange mb-2">Ninja Training</h1>
          <p className="text-naruto-black/60">Begin your ninja way</p>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-naruto-black">
          {isResetPassword
            ? 'Create New Secret Jutsu'
            : (isForgotPassword 
                ? 'Recover Your Jutsu' 
                : (isSignUp ? 'Join the Village' : 'Welcome Back, Ninja'))}
        </h2>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-naruto-red p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">⚠️</div>
              <div className="ml-3">
                <p className="text-sm text-naruto-red">{error}</p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">✅</div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isResetPassword && (
            <div>
              <label className="block text-sm font-medium text-naruto-black/70 mb-1">Ninja ID (Email)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-naruto-orange/30 focus:ring-2 focus:ring-naruto-orange focus:border-naruto-orange transition-colors"
                required={!isResetPassword}
              />
            </div>
          )}

          {(!isForgotPassword || isResetPassword) && (
            <div>
              <label className="block text-sm font-medium text-naruto-black/70 mb-1">
                {isResetPassword ? 'New Secret Jutsu (Password)' : 'Secret Jutsu (Password)'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-naruto-orange/30 focus:ring-2 focus:ring-naruto-orange focus:border-naruto-orange transition-colors"
                required={!isForgotPassword || isResetPassword}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-naruto-orange to-naruto-red hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-naruto-orange font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading 
              ? 'Loading...' 
              : (isResetPassword
                  ? 'Update Secret Jutsu'
                  : (isForgotPassword 
                      ? 'Send Recovery Scroll' 
                      : (isSignUp ? 'Begin Training' : 'Enter Village')))}
          </button>

          {!isForgotPassword && !isResetPassword && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-naruto-blue hover:text-naruto-orange font-medium transition-colors"
              >
                Forgot your secret jutsu?
              </button>
            </div>
          )}

          {(isForgotPassword || isResetPassword) && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full text-center text-sm text-naruto-orange hover:text-naruto-red font-medium transition-colors"
            >
              Back to sign in
            </button>
          )}

          {!isForgotPassword && !isResetPassword && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-naruto-orange/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-naruto-black/60">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-center text-sm text-naruto-orange hover:text-naruto-red font-medium transition-colors"
              >
                {isSignUp ? 'Already a ninja? Sign in' : 'New ninja? Join now'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}