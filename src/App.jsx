import React from 'react';
import HeaderBanner from './components/HeaderBanner';
import Navbar from './components/Navbar';
import CategoryNav from './components/CategoryNav';
import { categories } from './components/CategoryNav';
import ArticleCard from './components/ArticleCard';
import HorizontalArticleCard from './components/HorizontalArticleCard';
import { fetchTopHeadlines } from './api';
import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import AuthModal from './components/AuthModal';
import { auth } from './firebase';
import { addFavorite, removeFavorite, getFavorites } from './utils/favorites';
import { addBookmark, removeBookmark, getBookmarks } from './utils/bookmarks';
import { incrementArticleView, getTrendingArticles } from './utils/trending';
import CommentModal from './components/CommentModal';

export default function App() {
  const [showFavorites, setShowFavorites] = useState(false);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  // Track Firebase Auth user
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return unsub;
  }, []);

  // Fetch user favorites and bookmarks when user changes
  useEffect(() => {
    if (user) {
      getFavorites(user.uid).then(setFavorites).catch(() => setFavorites([]));
      getBookmarks(user.uid).then(setBookmarks).catch(() => setBookmarks([]));
    } else {
      setFavorites([]);
      setBookmarks([]);
    }
  }, [user]);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState('all'); // Default to 'all' for all articles

  const [search, setSearch] = useState("");
  const [headerLayout, setHeaderLayout] = useState('left');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = React.useRef(null);

  // Personalized feed state
  const [recommended, setRecommended] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  // Comments modal state
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentArticle, setCommentArticle] = useState(null);

  // Trending articles state
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  // Compute user interests from favorites and bookmarks
  // Fetch trending articles
  useEffect(() => {
    setTrendingLoading(true);
    getTrendingArticles(8).then(setTrending).catch(() => setTrending([])).finally(() => setTrendingLoading(false));
  }, []);

  useEffect(() => {
    async function fetchRecommended() {
      if (!user) { setRecommended([]); return; }
      setRecLoading(true);
      try {
        const all = [...favorites, ...bookmarks];
        // Extract keywords from titles, categories, and sources
        const keywords = Array.from(new Set(
          all.flatMap(a => [
            ...(a.title ? a.title.split(' ').slice(0, 2) : []),
            a.source?.name || '',
            a.category || ''
          ]).filter(Boolean)
        ));
        // Fetch top 1-2 articles for each keyword (limit to 10 requests)
        const topKeywords = keywords.slice(0, 10);
        const results = await Promise.all(
          topKeywords.map(k => fetchTopHeadlines({ q: k, pageSize: 2 }))
        );
        let recs = results.flatMap(r => r.articles || []);
        // Remove duplicates and articles already in favorites/bookmarks
        const seen = new Set([...favorites, ...bookmarks].map(a => a.url));
        recs = recs.filter(a => a.url && !seen.has(a.url));
        // Shuffle
        for (let i = recs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [recs[i], recs[j]] = [recs[j], recs[i]];
        }
        setRecommended(recs.slice(0, 8));
      } catch (e) {
        setRecommended([]);
      }
      setRecLoading(false);
    }
    fetchRecommended();
  }, [user, favorites, bookmarks]);

  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
  }, [category, search]);

  // Scroll Load More button into view after loading more articles
  useEffect(() => {
    if (page > 1 && loadMoreRef.current) {
      loadMoreRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [articles, page]);

  useEffect(() => {
    setLoading(true);
    setError("");
    // Find the selected category object
    const selectedCategoryObj = categories.find(cat => cat.value === category) || {};
    // If 'all' is selected, don't send category or keyword (unless searching)
    const isAll = category === 'all';
    if (isAll && !search) {
      // NewsAPI supported categories
      const apiCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
      Promise.all(apiCategories.map(cat =>
        fetchTopHeadlines({ category: cat, page, pageSize: 5 }) // use 5 per category for variety
      ))
        .then(results => {
          // Flatten, dedupe by url, and shuffle
          let allArticles = results.flatMap(r => r.articles || []);
          const seen = new Set();
          allArticles = allArticles.filter(a => {
            if (!a.url || seen.has(a.url)) return false;
            seen.add(a.url); return true;
          });
          // Shuffle for variety
          for (let i = allArticles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allArticles[i], allArticles[j]] = [allArticles[j], allArticles[i]];
          }
          setArticles(page === 1 ? allArticles : prev => {
            const urls = new Set(prev.map(a => a.url));
            const uniqueNew = allArticles.filter(a => !urls.has(a.url));
            return [...prev, ...uniqueNew];
          });
          setHasMore(false); // Optional: can set true if you want to support more pages
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      fetchTopHeadlines({
        category: isAll || search ? undefined : selectedCategoryObj.apiCategory,
        q: search ? search : (isAll ? undefined : selectedCategoryObj.keyword),
        page,
        pageSize: 20
      })
        .then(({ articles: newArticles, error }) => {
          if (error) setError(error);
          else {
            setArticles(prev => {
              if (page === 1) return newArticles;
              // Filter out duplicates by url
              const urls = new Set(prev.map(a => a.url));
              const uniqueNew = newArticles.filter(a => !urls.has(a.url));
              return [...prev, ...uniqueNew];
            });
            setHasMore(newArticles.length === 20);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [category, search, page]);



  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBanner />
      <Navbar 
  searchTerm={search}
  onSearch={setSearch}
  user={user}
  onLoginClick={() => setAuthOpen(true)}
  onFavoritesClick={() => setShowFavorites(true)}
  headerLayout={headerLayout}
  onToggleHeaderLayout={() => setHeaderLayout(h => h === 'left' ? 'center' : 'left')}
/>
      {!showFavorites && (
  <CategoryNav selected={category} onSelectCategory={c => { setCategory(c); setSearch(""); }} />
)}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-10">
        {/* Favorites/All toggle */}
        
        {loading && !showFavorites && (
          <div className="text-center text-gray-500">Loading news...</div>
        )}
        {showFavorites ? (
          <div className="grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {favorites.map((article, idx) => (
              <ArticleCard
                key={article.url || idx}
                article={article}
                isFavorite={true}
                onFavorite={async (a) => {
                  try {
                    await removeFavorite(user.uid, a.url);
                    setFavorites(favs => favs.filter(f => f.url !== a.url));
                  } catch (err) {
                    console.error('Remove favorite failed:', err);
                    setError('Failed to remove favorite: ' + (err.message || err));
                  }
                }}
              />
            ))}
          </div>
        ) : (
          !loading && !error && (
            <>
              {/* First 3 articles as horizontal cards, rest as grid */}
              {articles.slice(0, 3).map((article, idx) => {
                const isFav = favorites.some(fav => fav.url === article.url);
                const isBookmarked = bookmarks.some(bm => bm.url === article.url);
                return (
                  <HorizontalArticleCard
                    key={article.url || idx}
                    article={article}
                    isFavorite={isFav}
                    onFavorite={async (a) => {
                      if (!user) { setAuthOpen(true); return; }
                      try {
                        if (isFav) {
                          await removeFavorite(user.uid, a.url);
                          setFavorites(favs => favs.filter(f => f.url !== a.url));
                        } else {
                          await addFavorite(user.uid, a);
                          setFavorites(favs => [...favs, a]);
                        }
                      } catch (err) {
                        console.error('Favorite action failed:', err);
                        setError('Failed to update favorite: ' + (err.message || err));
                      }
                    }}
                    isBookmarked={isBookmarked}
                    onBookmark={async (a) => {
                      if (!user) { setAuthOpen(true); return; }
                      try {
                        if (isBookmarked) {
                          await removeBookmark(user.uid, a.url);
                          setBookmarks(bms => bms.filter(b => b.url !== a.url));
                        } else {
                          await addBookmark(user.uid, a);
                          setBookmarks(bms => [...bms, a]);
                        }
                      } catch (err) {
                        setError('Failed to update read later: ' + (err.message || err));
                      }
                    }}
                  />
                );
              })}
              <div className="grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
                {articles.slice(3).map((article, idx) => {
                  const isFav = favorites.some(fav => fav.url === article.url);
                  const isBookmarked = bookmarks.some(bm => bm.url === article.url);
                  return (
                    <ArticleCard
                      key={article.url || idx}
                      article={article}
                      isFavorite={isFav}
                      onFavorite={async (a) => {
                        if (!user) { setAuthOpen(true); return; }
                        try {
                          if (isFav) {
                            await removeFavorite(user.uid, a.url);
                            setFavorites(favs => favs.filter(f => f.url !== a.url));
                          } else {
                            await addFavorite(user.uid, a);
                            setFavorites(favs => [...favs, a]);
                          }
                        } catch (err) {
                          console.error('Favorite action failed:', err);
                          setError('Failed to update favorite: ' + (err.message || err));
                        }
                      }}
                      isBookmarked={isBookmarked}
                      onBookmark={async (a) => {
                        if (!user) { setAuthOpen(true); return; }
                        try {
                          if (isBookmarked) {
                            await removeBookmark(user.uid, a.url);
                            setBookmarks(bms => bms.filter(b => b.url !== a.url));
                          } else {
                            await addBookmark(user.uid, a);
                            setBookmarks(bms => [...bms, a]);
                          }
                        } catch (err) {
                          setError('Failed to update read later: ' + (err.message || err));
                        }
                      }}
                      onClick={async () => {
                        await incrementArticleView(article);
                        window.open(article.url, '_blank');
                      }}
                      onComment={() => {
                        setCommentArticle(article);
                        setCommentModalOpen(true);
                      }}
                    />
                  );
                })}
              </div>
              {/* Trending section */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Trending</h2>
                <div className="grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {trending.map((article, idx) => (
                    <ArticleCard
                      key={article.url || idx}
                      article={article}
                      isFavorite={favorites.some(fav => fav.url === article.url)}
                      onFavorite={async (a) => {
                        if (!user) { setAuthOpen(true); return; }
                        try {
                          if (favorites.some(fav => fav.url === a.url)) {
                            await removeFavorite(user.uid, a.url);
                            setFavorites(favs => favs.filter(f => f.url !== a.url));
                          } else {
                            await addFavorite(user.uid, a);
                            setFavorites(favs => [...favs, a]);
                          }
                        } catch (err) {
                          console.error('Favorite action failed:', err);
                          setError('Failed to update favorite: ' + (err.message || err));
                        }
                      }}
                      isBookmarked={bookmarks.some(bm => bm.url === article.url)}
                      onBookmark={async (a) => {
                        if (!user) { setAuthOpen(true); return; }
                        try {
                          if (bookmarks.some(bm => bm.url === a.url)) {
                            await removeBookmark(user.uid, a.url);
                            setBookmarks(bms => bms.filter(b => b.url !== a.url));
                          } else {
                            await addBookmark(user.uid, a);
                            setBookmarks(bms => [...bms, a]);
                          }
                        } catch (err) {
                          setError('Failed to update read later: ' + (err.message || err));
                        }
                      }}
                      onClick={async () => {
                        await incrementArticleView(article);
                        window.open(article.url, '_blank');
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Load More button */}
              {hasMore && !loading && (
                <div className="flex justify-center mt-8" ref={loadMoreRef}>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-6 py-2 rounded-full bg-accent dark:bg-accent-dark text-white font-semibold shadow hover:bg-accent-dark dark:hover:bg-accent mt-4 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading && (
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    )}
                    Load More
                  </button>
                </div>
              )}
            </>
          )
        )}
      </main>
      <BackToTopButton />
      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <CommentModal
        article={commentArticle}
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        user={user}
      />
    </div>
  );
}


