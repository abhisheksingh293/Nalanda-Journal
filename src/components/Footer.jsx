import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full mt-8 py-6 px-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
      <span>
        &copy; {new Date().getFullYear()} Nalanda Journal. All rights reserved.
      </span>
    </footer>
  );
}
