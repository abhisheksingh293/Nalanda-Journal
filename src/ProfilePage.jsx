import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ArticleCard from './components/ArticleCard';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import { auth } from './firebase';
import { getFavorites } from './utils/favorites';
import { getBookmarks } from './utils/bookmarks';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return unsub;
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        getFavorites(user.uid),
        getBookmarks(user.uid)
      ])
        .then(([favs, bms]) => {
          setFavorites(favs);
          setBookmarks(bms);
        })
        .catch(() => {
          setFavorites([]);
          setBookmarks([]);
        })
        .finally(() => setLoading(false));
    } else {
      setFavorites([]);
      setBookmarks([]);
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLoginClick={() => setAuthOpen(true)} onFavoritesClick={() => {}} />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        {!user ? (
          <div className="text-center text-gray-400">Please log in to view your profile.</div>
        ) : (
          <>
            <div className="mb-8 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col gap-2">
              <div className="font-semibold text-lg">{user.displayName || user.email}</div>
              <div className="text-gray-500 text-sm">{user.email}</div>
            </div>
            <h2 className="text-xl font-semibold mb-4">Read Later</h2>
            {loading ? (
              <div className="text-center text-gray-500 mb-8">Loading...</div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center text-gray-400 mb-8">No articles in your Read Later list.</div>
            ) : (
              <div className="grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {bookmarks.map((article, idx) => (
                  <ArticleCard
                    key={article.url || idx}
                    article={article}
                    isFavorite={favorites.some(fav => fav.url === article.url)}
                    isBookmarked={true}
                    onFavorite={null}
                    onBookmark={null}
                  />
                ))}
              </div>
            )}
            <h2 className="text-xl font-semibold mt-10 mb-4">Favorites</h2>
            {loading ? (
              <div className="text-center text-gray-500 mb-8">Loading...</div>
            ) : favorites.length === 0 ? (
              <div className="text-center text-gray-400 mb-8">No favorites yet.</div>
            ) : (
              <div className="grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {favorites.map((article, idx) => (
                  <ArticleCard
                    key={article.url || idx}
                    article={article}
                    isFavorite={true}
                    isBookmarked={bookmarks.some(bm => bm.url === article.url)}
                    onFavorite={null}
                    onBookmark={null}
                  />
                ))}
              </div>
            )}
          </>
        )}
        {error && <div className="text-center text-red-500 mt-4">{error}</div>}
      </main>
      <BackToTopButton />
      <Footer />
    </div>
  );
}
