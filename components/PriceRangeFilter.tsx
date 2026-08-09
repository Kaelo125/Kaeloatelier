"use client";

import { formatUGX } from "@/lib/utils";

interface Props {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

// A simple two-slider price range control. Two overlapping <input type="range">
// elements — one for the low bound, one for the high bound — is the lightest
// way to get a min/max range picker without a extra dependency.
export default function PriceRangeFilter({ min, max, value, onChange }: Props) {
  const [low, high] = value;

  function handleLowChange(v: number) {
    onChange([Math.min(v, high), high]);
  }

  function handleHighChange(v: number) {
    onChange([low, Math.max(v, low)]);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-navy/60 mb-2">
        <span>{formatUGX(low)}</span>
        <span>{formatUGX(high)}</span>
      </div>
      <div className="relative h-6">
        {/* Track */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-navy/10 rounded-full" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 bg-green rounded-full"
          style={{
            left: `${((low - min) / (max - min)) * 100}%`,
            right: `${100 - ((high - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={low}
          onChange={(e) => handleLowChange(Number(e.target.value))}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-navy [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={high}
          onChange={(e) => handleHighChange(Number(e.target.value))}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-navy [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
}
