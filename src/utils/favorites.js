import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from 'firebase/firestore';

export async function addFavorite(uid, article) {
  // Use article.url as unique ID
  const favRef = doc(db, 'users', uid, 'favorites', encodeURIComponent(article.url));
  await setDoc(favRef, article);
}

export async function removeFavorite(uid, articleUrl) {
  const favRef = doc(db, 'users', uid, 'favorites', encodeURIComponent(articleUrl));
  await deleteDoc(favRef);
}

export async function isFavorite(uid, articleUrl) {
  const favRef = doc(db, 'users', uid, 'favorites', encodeURIComponent(articleUrl));
  const snap = await getDoc(favRef);
  return snap.exists();
}

export async function getFavorites(uid) {
  const favsCol = collection(db, 'users', uid, 'favorites');
  const snap = await getDocs(favsCol);
  return snap.docs.map(doc => doc.data());
}
