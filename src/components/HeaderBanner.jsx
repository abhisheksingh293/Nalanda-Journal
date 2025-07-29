import React from 'react';

// To change the header image, swap the src URL below for another Unsplash image.
// Examples:
// https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80
// https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80

export default function HeaderBanner({ leftAlign = false }) {
  return leftAlign ? (
    <div className="relative w-full h-40 md:h-56 lg:h-64 flex items-center justify-start overflow-hidden mb-8 rounded-b-3xl shadow-md">
      <img
        src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80"
        alt="News Banner"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-70 dark:opacity-60"
      />
      <div className="relative z-10 flex items-center gap-4 ml-10">
        <svg width="48" height="48" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="18" fill="currentColor" className="text-accent dark:text-accent-dark" />
          <path d="M12 18h12M18 12v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2">
            Stay Informed, Instantly
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow-md">
            The world’s news, all in one place
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 dark:from-black/70 dark:to-black/80" />
    </div>
  ) : (
    <div className="relative w-full h-40 md:h-56 lg:h-64 flex items-center justify-center overflow-hidden mb-8 rounded-b-3xl shadow-md">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
        alt="News Banner"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-70 dark:opacity-60"
      />
      <div className="relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2">
          Stay Informed, Instantly
        </h1>
        <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow-md">
          The world’s news, all in one place
        </p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 dark:from-black/70 dark:to-black/80" />
    </div>
  );
}

