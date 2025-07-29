import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, increment, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Increment view count for an article
export async function incrementArticleView(article) {
  if (!article.url) return;
  const ref = doc(db, 'trending', encodeURIComponent(article.url));
  await setDoc(ref, {
    ...article,
    url: article.url,
    viewCount: increment(1),
    lastViewed: Date.now(),
  }, { merge: true });
}

// Get top N trending articles
export async function getTrendingArticles(n = 8) {
  const q = query(collection(db, 'trending'), orderBy('viewCount', 'desc'), limit(n));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data());
}
