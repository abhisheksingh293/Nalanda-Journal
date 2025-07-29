import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';

// Add a comment to an article
export async function addComment(articleUrl, user, text) {
  if (!articleUrl || !user || !text) return;
  const commentsRef = collection(db, 'comments', encodeURIComponent(articleUrl), 'items');
  await addDoc(commentsRef, {
    uid: user.uid,
    displayName: user.displayName || user.email,
    text,
    createdAt: serverTimestamp(),
  });
}

// Get comments for an article, newest first
export async function getComments(articleUrl) {
  if (!articleUrl) return [];
  const commentsRef = collection(db, 'comments', encodeURIComponent(articleUrl), 'items');
  const q = query(commentsRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data());
}
