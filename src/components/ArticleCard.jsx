import React from 'react';

export default function ArticleCard({ article, isFavorite, onFavorite, isBookmarked, onBookmark, onComment }) {
  // Try to get logo from Clearbit using the article's URL domain
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
      className="block bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:scale-[1.025] transition-all duration-300 p-4 flex flex-col h-full opacity-0 animate-fadein"
    >
      {article.urlToImage && (
        <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
            <button
              type="button"
              onClick={e => { e.preventDefault(); onFavorite && onFavorite(article); }}
              className="bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow hover:bg-accent/80 transition"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? (
                <svg width="24" height="24" fill="#e11d48" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="#e11d48" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
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
              className="bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow hover:bg-blue-500 hover:text-white transition"
              aria-label="Share article"
            >
              <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/></svg>
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">{article.title}</h2>
        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{article.description}</p>
        <div className="flex items-center justify-between mt-auto mb-1">
          <div className="flex items-center gap-2 min-w-0">
            {logoUrl && (
              <img src={logoUrl} alt="logo" className="w-5 h-5 object-contain rounded bg-gray-100 border" onError={e => e.target.style.display='none'} />
            )}
            <span className="text-xs text-blue-700 font-semibold truncate">{article.source.name}</span>
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
