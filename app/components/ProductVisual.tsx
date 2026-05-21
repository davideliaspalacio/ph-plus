import type { ProductVisualKey } from "../lib/products";

function BottleWithDispenser({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 200" className={className} aria-hidden>
      <rect x="60" y="6" width="20" height="18" rx="2" fill="#6b8db5" />
      <path d="M55 24h30v18H55z" fill="#9eb5d3" />
      <path d="M50 42h40v6H50z" fill="#3a4a66" />
      <path
        d="M42 50 Q42 44 50 44 H90 Q98 44 98 50 L106 190 Q106 196 100 196 H40 Q34 196 34 190 Z"
        fill="#b5d1ec"
        stroke="#7a9fc8"
        strokeWidth="1"
      />
      <path
        d="M50 58 Q60 70 70 65 Q80 60 92 70 L98 180 Q90 175 80 180 Q70 185 60 180 Q50 175 42 180 Z"
        fill="#cfe6f7"
        opacity="0.6"
      />
    </svg>
  );
}

function BottleOnly({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 200" className={className} aria-hidden>
      <rect x="58" y="6" width="24" height="14" rx="2" fill="#2c4a72" />
      <path d="M50 20h40v14H50z" fill="#4f7aaa" />
      <path
        d="M38 34 Q38 28 46 28 H94 Q102 28 102 34 L108 190 Q108 196 102 196 H38 Q32 196 32 190 Z"
        fill="#a6c8e6"
        stroke="#6a8fb8"
        strokeWidth="1"
      />
      <path
        d="M48 42 Q60 56 72 50 Q84 44 96 56 L102 180 Q92 174 80 180 Q68 186 56 180 Q44 174 38 180 Z"
        fill="#c8e0f5"
        opacity="0.55"
      />
    </svg>
  );
}

function GarrafasPromo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 200" className={className} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 14 + i * 38;
        return (
          <g key={i} transform={`translate(${x},20)`}>
            <rect x="10" y="0" width="14" height="10" rx="1" fill="#1b22a6" />
            <path
              d="M4 10 Q4 6 10 6 H24 Q30 6 30 10 L32 170 Q32 175 28 175 H6 Q2 175 2 170 Z"
              fill="#e7eef9"
              stroke="#6a7fb8"
              strokeWidth="0.8"
            />
            <rect x="6" y="56" width="22" height="58" rx="2" fill="#1b22a6" />
            <text
              x="17"
              y="92"
              textAnchor="middle"
              fontSize="11"
              fill="#fff"
              fontWeight="800"
              fontFamily="sans-serif"
            >
              PH+
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ProductVisual({
  visualKey,
  className,
}: {
  visualKey: ProductVisualKey;
  className?: string;
}) {
  if (visualKey === "kit") return <BottleWithDispenser className={className} />;
  if (visualKey === "garrafas") return <GarrafasPromo className={className} />;
  return <BottleOnly className={className} />;
}
