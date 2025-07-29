import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ArticleCard from './components/ArticleCard';
import Footer from './components/Footer';
import BackToTopButton from './components/BackToTopButton';
import { auth } from './firebase';
import { getFavorites, removeFavorite } from './utils/favorites';

export default function FavouritesPage() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
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
      getFavorites(user.uid)
        .then(setFavorites)
        .catch(() => setFavorites([]))
        .finally(() => setLoading(false));
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLoginClick={() => setAuthOpen(true)} onFavoritesClick={() => {}} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Your Favorites</h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading favorites...</div>
        ) : !user ? (
          <div className="text-center text-gray-400">Please log in to view your favorites.</div>
        ) : favorites.length === 0 ? (
          <div className="text-center text-gray-400">No favorites yet. Click the heart on any article to save it.</div>
        ) : (
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
                    setError('Failed to remove favorite: ' + (err.message || err));
                  }
                }}
              />
            ))}
          </div>
        )}
        {error && <div className="text-center text-red-500 mt-4">{error}</div>}
      </main>
      <BackToTopButton />
      <Footer />
    </div>
  );
}
