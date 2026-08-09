"use client";

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { RefreshCw } from "lucide-react";

export interface CaptchaHandle {
  // Returns true if the user's input matches the current challenge
  verify: () => boolean;
  reset: () => void;
}

// A lightweight arithmetic captcha — no external services needed, works
// fully offline, and is enough to deter casual bots on a demo checkout flow.
const Captcha = forwardRef<CaptchaHandle, { onChange: (value: string) => void }>(
  function Captcha({ onChange }, ref) {
    const [a, setA] = useState(0);
    const [b, setB] = useState(0);
    const [input, setInput] = useState("");

    const newChallenge = useCallback(() => {
      setA(Math.floor(Math.random() * 9) + 1);
      setB(Math.floor(Math.random() * 9) + 1);
      setInput("");
      onChange("");
    }, [onChange]);

    useEffect(() => {
      newChallenge();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      verify: () => Number(input) === a + b,
      reset: newChallenge,
    }));

    return (
      <div className="flex items-center gap-3">
        <div className="bg-cream rounded-xl px-4 py-3 font-display text-lg font-semibold text-navy select-none tracking-wider">
          {a} + {b} = ?
        </div>
        <input
          type="number"
          inputMode="numeric"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="Answer"
          className="flex-1 border border-navy/15 rounded-xl px-4 py-3 text-sm focus:border-green outline-none"
        />
        <button
          type="button"
          onClick={newChallenge}
          aria-label="New captcha"
          className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border border-navy/15 text-navy/60"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    );
  }
);

export default Captcha;
