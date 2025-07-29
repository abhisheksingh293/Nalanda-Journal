import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

export async function addBookmark(uid, article) {
  const ref = doc(db, 'users', uid, 'bookmarks', encodeURIComponent(article.url));
  await setDoc(ref, article);
}

export async function removeBookmark(uid, articleUrl) {
  const ref = doc(db, 'users', uid, 'bookmarks', encodeURIComponent(articleUrl));
  await deleteDoc(ref);
}

export async function getBookmarks(uid) {
  const snap = await getDocs(collection(db, 'users', uid, 'bookmarks'));
  return snap.docs.map(doc => doc.data());
}
