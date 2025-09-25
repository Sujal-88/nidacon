// components/ToothIcon.js
import React from 'react';

const ToothIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19.34 8.66a2.29 2.29 0 0 0-2.6-3.79 2.29 2.29 0 0 0-2.52 3.82 2.29 2.29 0 0 0-.2 4.12l-2.43 2.43a2.29 2.29 0 0 1-3.24 0l-1.16-1.16a2.29 2.29 0 0 1 0-3.24l2.43-2.43a2.29 2.29 0 0 0 4.12-.2 2.29 2.29 0 0 0 3.82-2.52 2.29 2.29 0 0 0-3.79-2.6Z" />
    <path d="m12 12 4.88 4.88" />
    <path d="M12 17.12V12" />
    <path d="M12 12H6.88" />
  </svg>
);

export default ToothIcon;