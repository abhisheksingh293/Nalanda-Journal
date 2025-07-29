import React from 'react';

export default function HorizontalArticleCard({ article, isFavorite, onFavorite, isBookmarked, onBookmark }) {
  let logoUrl = null;
  try {
    const urlObj = new URL(article.url);
    logoUrl = `https://logo.clearbit.com/${urlObj.hostname}`;
  } catch (e) {
    logoUrl = null;
  }
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : '';

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col md:flex-row bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.015] transition-all duration-300 overflow-hidden mb-8 opacity-0 animate-fadein"
      style={{ minHeight: '170px' }}
    >
      {article.urlToImage && (
        <div className="relative w-full md:w-64 h-44 md:h-auto flex-shrink-0 overflow-hidden">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">{article.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-3">{article.description}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
            {/* Favorite button */}
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 items-end">
              {onFavorite && (
                <button
                  className="p-1 rounded-full bg-white/80 hover:bg-accent/90 hover:text-white text-accent shadow transition-all"
                  onClick={e => { e.preventDefault(); onFavorite(article); }}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#14b8a6" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#14b8a6" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 6.75a6.375 6.375 0 00-11.346-2.063 6.375 6.375 0 00-11.346-2.063c0 7.013 9.375 10.5 9.375 10.5s9.375-3.487 9.375-10.5z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#14b8a6" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 6.75a6.375 6.375 0 00-11.346-2.063 6.375 6.375 0 00-11.346-2.063c0 7.013 9.375 10.5 9.375 10.5s9.375-3.487 9.375-10.5z" />
                    </svg>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={e => { e.preventDefault(); onBookmark && onBookmark(article); }}
                className={`p-1 rounded-full bg-white/80 hover:bg-yellow-400 hover:text-white transition ${isBookmarked ? 'text-yellow-500' : ''}`}
                aria-label={isBookmarked ? 'Remove from read later' : 'Add to read later'}
              >
                {isBookmarked ? (
                  <svg width="22" height="22" fill="#facc15" viewBox="0 0 24 24"><path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2H5z"/></svg>
                ) : (
                  <svg width="22" height="22" fill="none" stroke="#facc15" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2H5z"/></svg>
                )}
              </button>
              <button
                type="button"
                onClick={e => {
                  e.preventDefault();
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      text: article.description || '',
                      url: article.url
                    });
                  } else {
                    navigator.clipboard.writeText(article.url);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="p-1 rounded-full bg-white/80 hover:bg-blue-500 hover:text-white text-blue-600 shadow transition-all"
                aria-label="Share article"
              >
                <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/></svg>
              </button>
            </div>
          <div className="flex items-center gap-2 min-w-0">
            {logoUrl && (
              <img src={logoUrl} alt="logo" className="w-5 h-5 object-contain rounded bg-gray-100 border" onError={e => e.target.style.display='none'} />
            )}
            <span className="text-xs text-accent dark:text-accent-dark font-semibold truncate">{article.source.name}</span>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">{formattedDate}</span>
        </div>
        {article.author && (
          <div className="text-xs text-gray-500 truncate">By {article.author}</div>
        )}
      </div>
    </a>
  );
}
