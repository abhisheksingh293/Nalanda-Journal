import React, { useEffect, useState } from 'react';
import { addComment, getComments } from '../utils/comments';

export default function CommentModal({ article, open, onClose, user }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && article) {
      setLoading(true);
      getComments(article.url)
        .then(setComments)
        .catch(() => setComments([]))
        .finally(() => setLoading(false));
    }
  }, [open, article]);

  async function handlePost(e) {
    e.preventDefault();
    if (!user) { setError('Please log in to comment.'); return; }
    if (!text.trim()) return;
    setPosting(true);
    setError('');
    try {
      await addComment(article.url, user, text.trim());
      setText('');
      // Reload comments
      const newComments = await getComments(article.url);
      setComments(newComments);
    } catch (e) {
      setError('Failed to post comment.');
    }
    setPosting(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl">×</button>
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        {loading ? (
          <div className="text-gray-500 mb-4">Loading...</div>
        ) : comments.length === 0 ? (
          <div className="text-gray-400 mb-4">No comments yet. Be the first to comment!</div>
        ) : (
          <div className="mb-4 max-h-52 overflow-y-auto flex flex-col gap-3">
            {comments.map((c, i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded p-2">
                <div className="text-sm text-gray-700 dark:text-gray-200 font-medium">{c.displayName || 'User'}</div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">{c.text}</div>
                <div className="text-xs text-gray-400 mt-1">{c.createdAt?.seconds ? new Date(c.createdAt.seconds*1000).toLocaleString() : ''}</div>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handlePost} className="flex gap-2 mt-2">
          <input
            type="text"
            className="flex-1 rounded border px-3 py-2 text-sm bg-white dark:bg-gray-800"
            placeholder={user ? 'Write a comment...' : 'Log in to comment'}
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={posting || !user}
            maxLength={300}
          />
          <button
            type="submit"
            className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded disabled:opacity-60"
            disabled={posting || !user || !text.trim()}
          >Post</button>
        </form>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>
    </div>
  );
}
