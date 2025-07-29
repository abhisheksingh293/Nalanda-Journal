import React, { useState } from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export default function AuthModal({ open, onClose }) {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm relative border border-gray-200 dark:border-gray-800 animate-fadein">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-accent">&times;</button>
        <div className="flex mb-6">
          <button className={`flex-1 py-2 rounded-l-lg font-semibold transition-all ${tab === 'login' ? 'bg-accent text-white shadow' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => { setTab('login'); setResetMode(false); setError(''); }}>{'Login'}</button>
          <button className={`flex-1 py-2 rounded-r-lg font-semibold transition-all ${tab === 'signup' ? 'bg-accent text-white shadow' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => { setTab('signup'); setResetMode(false); setError(''); }}>{'Sign Up'}</button>
        </div>

        {/* Forgot Password Mode */}
        {resetMode ? (
          <form onSubmit={async e => {
            e.preventDefault();
            setResetLoading(true);
            setResetError('');
            setResetSent(false);
            try {
              await sendPasswordResetEmail(auth, resetEmail);
              setResetSent(true);
            } catch (err) {
              setResetError(err.message || 'Failed to send reset email');
            }
            setResetLoading(false);
          }} className="flex flex-col gap-3 mb-4 animate-fadein">
            <input type="email" required placeholder="Enter your email" className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
            <button type="submit" disabled={resetLoading} className="bg-accent text-white rounded py-2 font-bold hover:bg-accent-dark transition disabled:opacity-60">{resetLoading ? 'Sending...' : 'Send Reset Link'}</button>
            <button type="button" className="text-xs text-gray-500 hover:underline mt-1" onClick={() => setResetMode(false)}>Back to Login</button>
            {resetSent && <div className="text-green-600 text-xs text-center mt-1">Reset email sent! Check your inbox.</div>}
            {resetError && <div className="text-red-500 text-xs text-center mt-1">{resetError}</div>}
          </form>
        ) : (
        <>
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-3 mb-2">
            <input type="email" required placeholder="Email" className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" required placeholder="Password" className="px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-700" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" disabled={loading} className="bg-accent text-white rounded py-2 font-bold hover:bg-accent-dark transition disabled:opacity-60">{tab === 'login' ? 'Login' : 'Sign Up'}</button>
          </form>
          {tab === 'login' && (
            <button type="button" className="text-xs text-accent hover:underline mb-4 text-left" onClick={() => { setResetMode(true); setResetEmail(email); setResetSent(false); setResetError(''); }}>Forgot password?</button>
          )}
        </>) }

        <div className="my-4 flex items-center gap-2 text-xs text-gray-400">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />or<div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>
        <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded py-2 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-60">
          <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.23l6.84-6.84C35.87 2.42 30.33 0 24 0 14.61 0 6.44 5.82 2.69 14.09l7.98 6.2C12.53 13.19 17.82 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.75H24v9.02h12.39c-.53 2.83-2.13 5.23-4.53 6.85l7.01 5.46C43.66 36.74 46.1 31.19 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29a14.6 14.6 0 010-8.58l-7.98-6.2A23.94 23.94 0 000 24c0 3.84.92 7.47 2.69 10.49l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.33 0 11.64-2.09 15.52-5.7l-7.01-5.46c-1.95 1.31-4.44 2.09-8.51 2.09-6.18 0-11.47-3.69-13.33-8.99l-7.98 6.2C6.44 42.18 14.61 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Continue with Google
        </button>
        {error && <div className="mt-4 text-red-500 text-xs text-center">{error}</div>}
      </div>
    </div>
  );
}
