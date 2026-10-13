import React from "react";

const paths = {
  home: "M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9",
  learn:
    "M12 5v16M12 5C8 2 4 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-2-1-6-2-10 1Z",
  review: "M20 7v5h-5M20 12a8 8 0 1 0-2 6M20 7v5",
  paper: "m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15l-1 5Z",
  jlpt: "M4 21V5m0 0c6-5 10 5 16 0v10c-6 5-10-5-16 0",
  settings: "M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-8 0v6",
  flame:
    "M13 2c1 6-4 7-4 11-2-1-3-3-3-5-7 10 0 15 6 14 9-1 9-10 4-15 0 3-2 4-3 4 1-3 1-6 0-9Z",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  sound: "M4 9h4l5-4v14l-5-4H4V9Zm13-2c4 3 4 7 0 10m-1-7c2 1 2 3 0 4",
};
export default function Icon({ name, className = "" }) {
  return (
    <svg
      className={`ui-icon ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name] || paths.learn} />
    </svg>
  );
}
