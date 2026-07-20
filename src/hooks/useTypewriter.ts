"use client";

import { useEffect, useState } from "react";
import { TYPEWRITER_TIMING } from "@/data/hero";


export function useTypewriter(words: string[], enabled = true): string {
  const [text, setText] = useState(words[0] ?? "");

  useEffect(() => {
    if (!enabled || words.length === 0) return;

    let wordIndex = 0;
    let charCount = words[0].length;
    let deleting = true;
    let timeout: ReturnType<typeof setTimeout>;

    const step = () => {
      let delay: number;

      if (deleting) {
        charCount -= 1;
        delay = TYPEWRITER_TIMING.deleteMs;
        if (charCount <= 0) {
          charCount = 0;
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      } else {
        charCount += 1;
        delay = TYPEWRITER_TIMING.typeMs;
        if (charCount >= words[wordIndex].length) {
          charCount = words[wordIndex].length;
          deleting = true;
          delay = TYPEWRITER_TIMING.pauseMs;
        }
      }

      setText(words[wordIndex].slice(0, charCount));
      timeout = setTimeout(step, delay);
    };

    timeout = setTimeout(step, TYPEWRITER_TIMING.pauseMs);
    return () => clearTimeout(timeout);
  }, [words, enabled]);

  return text;
}
