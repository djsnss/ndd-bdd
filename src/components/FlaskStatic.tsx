import React, { useEffect, useState } from "react";

export const FlaskStatic = React.memo(() => {
  const [circles, setCircles] = useState<
    { id: number; cx: number; cy: number; r: number; delay: number }[]
  >([]);

  useEffect(() => {
    // This code runs only on the client
    const computedCircles = Array.from({ length: 10 }).map((_, i) => {
      const cx = 4 + Math.random() * 12;
      const cy = 17 + Math.random() * 5;
      const r = 0.4 + Math.random() * 0.2;
      const delay = -Math.random() * 4;
      return { id: i, cx, cy, r, delay };
    });
    setCircles(computedCircles);
  }, []);

  // Return null or a fallback during SSR/hydration
  if (circles.length === 0) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="250"
      height="350"
      viewBox="3 2 18 20"
      className="text-indigo-400"
    >
      <defs>
        <clipPath id="flaskClip">
          <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
        </clipPath>
      </defs>

      {/* Flask outline */}
      <path
        d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 2h7"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bubbles computed on the client */}
      <g clipPath="url(#flaskClip)">
        {circles.map(({ id, cx, cy, r, delay }) => (
          <circle
            key={id}
            cx={cx}
            cy={cy}
            r={r}
            fill="rgb(255, 105, 105)"
            className="animate-bubble"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </g>
    </svg>
  );
});
