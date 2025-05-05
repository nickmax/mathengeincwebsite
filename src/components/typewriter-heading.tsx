
'use client';

import { useState, useEffect, type FC } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterHeadingProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export const TypewriterHeading: FC<TypewriterHeadingProps> = ({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 1500,
  className,
}) => {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeoutId: NodeJS.Timeout;

    if (isDeleting) {
      // Deleting
      if (charIndex > 0) {
        timeoutId = setTimeout(() => {
          setText(currentPhrase.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, deletingSpeed);
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      }
    } else {
      // Typing
      if (charIndex < currentPhrase.length) {
        timeoutId = setTimeout(() => {
          setText(currentPhrase.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
      } else {
        // Finished typing, pause then start deleting
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, charIndex, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={cn('text-primary inline-block', className)}>
      {text}
      {/* Blinking cursor simulation */}
      <span className="animate-pulse">|</span>
    </span>
  );
};
