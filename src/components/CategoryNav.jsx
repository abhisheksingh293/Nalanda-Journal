import React from 'react';

export const categories = [
  { label: 'All', value: 'all' },

  { label: 'World', value: 'general', apiCategory: 'general', icon: (
    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>
  ) },
  { label: 'Business', value: 'business', apiCategory: 'business', icon: (
    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></svg>
  ) },
  { label: 'Technology', value: 'technology', apiCategory: 'technology', icon: (
    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3v4M8 3v4M12 16h.01" /></svg>
  ) },
  { label: 'Science', value: 'science', apiCategory: 'science', icon: (
    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v2m0 16v2m8-10h2M2 12H4m15.364-7.364l1.414 1.414M4.222 19.778l1.414-1.414M19.778 19.778l-1.414-1.414M4.222 4.222l1.414 1.414" /></svg>
  ) },
  { label: 'Health', value: 'health', apiCategory: 'health', icon: (
    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21C12 21 7 16.5 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 16.5 12 21 12 21Z" /></svg>
  ) },
  { label: 'Sports', value: 'sports', apiCategory: 'sports', icon: (
    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M4 4l16 16" /></svg>
  ) },
  { label: 'Entertainment', value: 'entertainment', apiCategory: 'entertainment', icon: (
    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
  ) },

];

export default function CategoryNav({ selected, onSelectCategory }) {
  return (
    <nav className="sticky top-16 z-30 w-full overflow-x-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm py-4 md:py-5 px-2">
      <div className="flex gap-3 md:gap-4 items-center justify-center min-w-max overflow-x-auto scrollbar-thin scrollbar-thumb-accent/40 scrollbar-track-transparent">
        {categories.map(cat => (
          <button
            key={cat.value}
            className={`flex items-center gap-2 px-5 py-2 md:px-6 md:py-2.5 rounded-full text-sm md:text-base font-semibold transition-all shadow-sm border focus:outline-none focus:ring-2 focus:ring-accent whitespace-nowrap
              ${selected === cat.value ? 'bg-accent text-white shadow-md border-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-accent/20 dark:hover:bg-accent/30'}`}
            onClick={() => onSelectCategory(cat.value)}
            aria-pressed={selected === cat.value}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
