import { useEffect, useState } from "react";
import FlashCard from "./FlashCard/FlashCard";
import type { Deck } from "../types";

type StudyModeProps = {
  deck: Deck;
  onClose: () => void;
  onToggleReview: (index: number) => void;
};

/**
 * Provides an isolated study layer for one deck with review marking and playback.
 * It connects to App through the deck data, close callback, and review callback.
 * @param props Selected deck and parent handlers for closing and marking cards.
 */
export default function StudyMode({ deck, onClose, onToggleReview }: StudyModeProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying || deck.cards.length === 0) return;

    const timer = window.setInterval(() => {
      if (!isFlipped) {
        setIsFlipped(true);
      } else if (activeIndex === deck.cards.length - 1) {
        setIsPlaying(false);
      } else {
        setActiveIndex((current) => current + 1);
        setIsFlipped(false);
      }
    }, 3000);

    return () => window.clearInterval(timer);
  }, [activeIndex, deck.cards.length, isFlipped, isPlaying]);

  /** Changes the active study card and resets its visible face. */
  function showCard(index: number) {
    setActiveIndex(index);
    setIsFlipped(false);
  }

  const activeCard = deck.cards[activeIndex];

  /** Renders the centered study card, review action, playback controls, and exit button. */
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-[#090a0d]/95 p-4 backdrop-blur-md sm:p-8">
      <div className="flex min-h-full items-center justify-center">
        <section className="flex w-full max-w-2xl flex-col items-center rounded-lg border border-white/10 bg-[#161618]/90 p-5 text-white shadow-2xl sm:p-8">
          <div className="mb-6 flex w-full items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Study mode</p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{deck.name}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Exit study mode"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-black/45 text-xl text-white/75 transition hover:bg-black/70 hover:text-white"
            >
              ×
            </button>
          </div>

          {activeCard ? (
            <>
              <div className="flex w-full justify-center py-4 sm:py-8">
                <div key={activeIndex} className="w-full max-w-md animate-[card-enter_220ms_ease-out]">
                  <FlashCard
                    {...activeCard}
                    flipped={isFlipped}
                    onFlip={() => setIsFlipped((current) => !current)}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleReview(activeIndex)}
                className={`mb-6 rounded-lg border px-4 py-2 text-sm transition ${
                  activeCard.review
                    ? "border-amber-300/60 bg-amber-300/15 text-amber-100"
                    : "border-white/15 bg-black/45 text-white/75 hover:bg-black/70 hover:text-white"
                }`}
              >
                {activeCard.review ? "! Marked for review" : "Mark for review"}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying((current) => !current);
                    setIsFlipped(false);
                  }}
                  className="rounded-lg border border-white/15 bg-black/45 px-5 py-2 text-white/80 backdrop-blur transition hover:bg-black/70 hover:text-white"
                >
                  {isPlaying ? "⏸ Pausar" : "▶ Play"}
                </button>
                <button
                  type="button"
                  onClick={() => showCard(activeIndex === 0 ? deck.cards.length - 1 : activeIndex - 1)}
                  aria-label="Previous card"
                  className="rounded-lg border border-white/15 bg-black/45 px-4 py-2 text-white/80 backdrop-blur transition hover:bg-black/70 hover:text-white"
                >
                  ← Previous
                </button>
                <span className="min-w-16 text-center text-sm text-white/55">
                  {activeIndex + 1} / {deck.cards.length}
                </span>
                <button
                  type="button"
                  onClick={() => showCard((activeIndex + 1) % deck.cards.length)}
                  aria-label="Next card"
                  className="rounded-lg border border-white/15 bg-black/45 px-4 py-2 text-white/80 backdrop-blur transition hover:bg-black/70 hover:text-white"
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <p className="py-16 text-center text-white/60">This deck has no cards to study.</p>
          )}
        </section>
      </div>
    </div>
  );
}
