import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faUserCircle, faCircleUser } from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ searchTerm, onSearch, onToggleHeaderLayout, headerLayout, user, onLoginClick, onFavoritesClick }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [value, setValue] = React.useState(searchTerm || "");
  const [dark, setDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  React.useEffect(() => {
    setValue(searchTerm || "");
  }, [searchTerm]);

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value.trim());
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg px-4 md:px-8 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
      {/* Left: Logo & Name */}
      <div className="flex items-center gap-3 min-w-0">
        
        <Link to="/" className="text-xl md:text-2xl font-extrabold tracking-tight text-accent dark:text-accent-dark truncate focus:outline-none">
  Nalanda Journal
</Link>
      </div>
      {/* Center: Search bar (centered on desktop, full width on mobile) */}
      <form onSubmit={handleSubmit} className="flex-1 flex justify-center min-w-0 mx-2">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={handleSubmit}
          placeholder="Search news..."
          className="w-full max-w-md px-4 py-2 border rounded-full bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring focus:border-accent text-gray-900 dark:text-gray-100 shadow-sm transition"
        />
      </form>
      {/* Right: Actions */}
      <div className="flex items-center gap-2 ml-2">
        <button
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-full transition bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => setDark(d => !d)}
        >
          {dark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 15a5 5 0 100-10 5 5 0 000 10zm0 2a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm0-14a1 1 0 01-1-1V1a1 1 0 112 0v1a1 1 0 01-1 1zm9 9a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-14 0a1 1 0 01-1 1H1a1 1 0 110-2h1a1 1 0 011 1zm11.071 5.071a1 1 0 010 1.415l-.707.707a1 1 0 11-1.415-1.415l.707-.707a1 1 0 011.415 0zm-10.142 0a1 1 0 010 1.415l-.707.707a1 1 0 01-1.415-1.415l.707-.707a1 1 0 011.415 0zm10.142-10.142a1 1 0 011.415 0l.707.707a1 1 0 11-1.415 1.415l-.707-.707a1 1 0 010-1.415zm-10.142 0a1 1 0 011.415 0l.707.707a1 1 0 11-1.415 1.415l-.707-.707a1 1 0 010-1.415z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800 dark:text-gray-200" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
        
      </div>
      {/* User Auth Section */}
      <div className="ml-4 flex items-center">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="p-2 rounded-full bg-accent text-white hover:bg-accent-dark transition"
              aria-label="User menu"
            >
              <FontAwesomeIcon icon={faCircleUser} className="h-6 w-6" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg z-50 py-2">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-accent/10 dark:hover:bg-accent-dark/20 text-gray-800 dark:text-gray-100"
                  onClick={() => { setMenuOpen(false); window.location.href = '/profile'; }}
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-accent/10 dark:hover:bg-accent-dark/20 text-gray-800 dark:text-gray-100"
                  onClick={() => { setMenuOpen(false); window.location.href = '/favourit'; }}
                >
                  Favorites
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-accent/10 dark:hover:bg-accent-dark/20 text-gray-800 dark:text-gray-100"
                  onClick={() => { setMenuOpen(false); signOut(auth); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-4 py-1.5 rounded bg-accent text-white font-semibold text-sm shadow hover:bg-accent-dark transition"
            aria-label="Login or Sign Up"
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </nav>
  );
}
